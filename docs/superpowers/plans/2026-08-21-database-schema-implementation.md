# Struttura Database — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Creare le migrazioni SQL e le policy RLS che implementano lo schema
dati approvato in `docs/superpowers/specs/2026-08-21-database-schema-design.md`,
più un helper TypeScript puro per verificare le finestre temporali di
campagna, riusabile da qualunque codice futuro (API routes, dashboard).

**Architecture:** Sei tabelle Postgres (`survey_campaigns`, `submissions`,
`nominative_responses`, `nominative_responses_history`, `anonymous_tokens`,
`anonymous_responses`) create tramite migrazioni SQL versionate in
`web/supabase/migrations/`, con Row Level Security come layer di
enforcement primario per la fase nominativa e come "nessun accesso" totale
per la fase anonima (solo `service_role` può toccarla). Un trigger su
`nominative_responses` popola lo storico e aggiorna `submissions.last_edited_at`
in una singola transazione.

**Tech Stack:** Postgres/Supabase (SQL puro, RLS, funzioni `plpgsql`/`sql`),
TypeScript + Vitest per l'helper di verifica finestre.

## Global Constraints

- Schema e regole vincolanti: vedi
  `docs/superpowers/specs/2026-08-21-database-schema-design.md` sezioni 2-5 —
  ogni tabella e vincolo qui sotto discende direttamente da lì.
- **Adattamento al ciclo di test**: questo ambiente non ha un progetto
  Supabase collegato né un Postgres locale (`docker`/`psql` non disponibili
  in questa sessione). Per i task di migrazione SQL, il "test" non è
  automatizzato: ogni task include query di verifica manuale da eseguire
  nello SQL Editor di Supabase (o via `psql`) non appena esiste un progetto
  collegato — stesso pattern già usato in questo repo per il codice
  dipendente da una sessione Supabase reale (vedi `web/README.md`, sezione
  Test: "La sessione Supabase vera e propria... va verificata manualmente").
  Il task 8 (helper TypeScript puro) segue invece TDD automatizzato standard
  con Vitest, perché non dipende da un database reale.
- Convenzione di naming: tabelle/colonne in `snake_case` (Postgres
  standard, coerente con l'ER diagram già in
  `docs/architettura-proposta-pilota.md`); ruoli applicativi già definiti in
  `web/src/lib/auth/routeAccess.ts` (`employee`, `hr_admin`), letti dal JWT
  Supabase via `auth.jwt() -> 'app_metadata' ->> 'role'`.
- Ogni migrazione va scritta come file `.sql` in
  `web/supabase/migrations/<timestamp>_<nome>.sql` — convenzione compatibile
  con la Supabase CLI (`supabase db push`) se/quando verrà installata, ma
  applicabile anche a mano oggi via SQL Editor.
- Fuori scope per questo piano (vedi spec sezione 7): viste aggregate per la
  dashboard HR, UI della dashboard, wiring delle API routes che useranno
  queste tabelle per persistere le risposte del survey (SurveyApp React) —
  quest'ultimo è un sottosistema separato, da pianificare a parte una volta
  che questo schema è in produzione.

---

## File Structure

```
web/supabase/migrations/
  20260821162927_survey_campaigns.sql
  20260821162928_submissions.sql
  20260821162929_nominative_responses.sql
  20260821162930_nominative_responses_history.sql
  20260821162931_anonymous_tokens.sql
  20260821162932_anonymous_responses.sql
  20260821162933_rls_policies.sql
web/src/lib/campaigns/
  windows.ts               — isCompilationOpen(), isEditOpen()
web/tests/lib/
  campaigns-windows.test.ts
web/README.md              — nuova sezione su come applicare le migrazioni
```

---

### Task 1: Cartella migrazioni + tabella `survey_campaigns`

**Files:**
- Create: `web/supabase/migrations/20260821162927_survey_campaigns.sql`
- Modify: `web/README.md`

**Interfaces:**
- Produces: tabella `public.survey_campaigns(id, name, compilation_window_start, compilation_window_end, edit_window_start, edit_window_end, created_at, updated_at)`; funzione `public.set_updated_at()` (trigger generico, riusato dai task successivi).

- [ ] **Step 1: Scrivi la migrazione**

```sql
-- web/supabase/migrations/20260821162927_survey_campaigns.sql

-- Estensione per gen_random_uuid(); Supabase la abilita già di default,
-- dichiarata qui esplicitamente per idempotenza/portabilità.
create extension if not exists pgcrypto;

create table public.survey_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  compilation_window_start timestamptz not null,
  compilation_window_end timestamptz not null,
  edit_window_start timestamptz,
  edit_window_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint compilation_window_valid
    check (compilation_window_end > compilation_window_start),
  constraint edit_window_valid check (
    (edit_window_start is null and edit_window_end is null)
    or (
      edit_window_start is not null
      and edit_window_end is not null
      and edit_window_end > edit_window_start
    )
  )
);

comment on table public.survey_campaigns is
  'Una edizione ricorrente del survey (es. "Open Listening 2026"). Ogni compilazione (nominativa e anonima) appartiene a una campagna.';
comment on column public.survey_campaigns.edit_window_start is
  'null = modifiche non attive; HR apre la finestra impostando entrambe le date insieme.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_survey_campaigns_updated_at
before update on public.survey_campaigns
for each row
execute function public.set_updated_at();
```

- [ ] **Step 2: Verifica manuale (una volta collegato un progetto Supabase)**

Esegui nello SQL Editor di Supabase:

```sql
insert into public.survey_campaigns (name, compilation_window_start, compilation_window_end)
values ('Test 2026', now(), now() + interval '30 days')
returning id, created_at, updated_at;
-- Expected: 1 riga, created_at e updated_at popolati automaticamente

insert into public.survey_campaigns (name, compilation_window_start, compilation_window_end)
values ('Invalid', now(), now() - interval '1 day');
-- Expected: ERROR: new row for relation "survey_campaigns" violates check constraint "compilation_window_valid"

insert into public.survey_campaigns (name, compilation_window_start, compilation_window_end, edit_window_start)
values ('Invalid2', now(), now() + interval '30 days', now());
-- Expected: ERROR: new row for relation "survey_campaigns" violates check constraint "edit_window_valid"

update public.survey_campaigns set name = 'Test 2026 rinominato' where name = 'Test 2026';
select updated_at from public.survey_campaigns where name = 'Test 2026 rinominato';
-- Expected: updated_at è cambiato rispetto all'insert (trigger set_updated_at ha funzionato)
```

- [ ] **Step 3: Documenta la convenzione nel README**

Aggiungi a `web/README.md`, dopo la sezione "## Test", una nuova sezione:

```markdown
## Migrazioni database

Le migrazioni SQL vivono in `web/supabase/migrations/`, con naming
`<timestamp>_<nome>.sql` (convenzione compatibile con la Supabase CLI, non
ancora installata in questo progetto). Per applicarle oggi:

1. Apri il progetto Supabase → **SQL Editor**.
2. Esegui i file in `web/supabase/migrations/` **in ordine di timestamp**
   (crescente), uno alla volta.
3. Ogni file di migrazione contiene, nel piano di implementazione che l'ha
   generato (`docs/superpowers/plans/2026-08-21-database-schema-implementation.md`),
   le query di verifica manuale corrispondenti — eseguile dopo ogni
   migrazione per confermare che vincoli/trigger funzionino come previsto.

Se in futuro si installa la Supabase CLI (`supabase link` + `supabase db
push`), questa stessa cartella funziona senza modifiche.
```

- [ ] **Step 4: Commit**

```bash
git add web/supabase/migrations/20260821162927_survey_campaigns.sql web/README.md
git commit -m "feat(db): add survey_campaigns table migration"
```

---

### Task 2: Tabella `submissions`

**Files:**
- Create: `web/supabase/migrations/20260821162928_submissions.sql`

**Interfaces:**
- Consumes: `public.survey_campaigns(id)` (Task 1).
- Produces: tabella `public.submissions(id, campaign_id, user_id, status, submitted_at, last_edited_at, created_at)`, `UNIQUE(user_id, campaign_id)`.

- [ ] **Step 1: Scrivi la migrazione**

```sql
-- web/supabase/migrations/20260821162928_submissions.sql

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.survey_campaigns(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted')),
  submitted_at timestamptz,
  last_edited_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, campaign_id)
);

comment on table public.submissions is
  'Una compilazione della fase nominativa per un utente in una campagna. id = GUID di riferimento mostrato al dipendente a fine survey. Una sola riga per (user_id, campaign_id): il vincolo UNIQUE garantisce "una compilazione per utente per campagna".';
```

- [ ] **Step 2: Verifica manuale**

Sostituisci `<campaign_id>` con l'id restituito dall'insert del Task 1, e
`<user_id>` con l'id di un utente reale in `auth.users` (es. il tuo utente
di test):

```sql
insert into public.submissions (campaign_id, user_id)
values ('<campaign_id>', '<user_id>')
returning id, status, created_at;
-- Expected: 1 riga, status = 'in_progress'

insert into public.submissions (campaign_id, user_id)
values ('<campaign_id>', '<user_id>');
-- Expected: ERROR: duplicate key value violates unique constraint "submissions_user_id_campaign_id_key"

update public.submissions set status = 'bogus' where user_id = '<user_id>';
-- Expected: ERROR: new row for relation "submissions" violates check constraint "submissions_status_check"

update public.submissions set status = 'submitted', submitted_at = now() where user_id = '<user_id>';
-- Expected: 1 riga aggiornata senza errori
```

- [ ] **Step 3: Commit**

```bash
git add web/supabase/migrations/20260821162928_submissions.sql
git commit -m "feat(db): add submissions table migration"
```

---

### Task 3: Tabella `nominative_responses`

**Files:**
- Create: `web/supabase/migrations/20260821162929_nominative_responses.sql`

**Interfaces:**
- Consumes: `public.submissions(id)` (Task 2), `public.set_updated_at()` (Task 1).
- Produces: tabella `public.nominative_responses(id, submission_id, question_id, answer, updated_at)`, `UNIQUE(submission_id, question_id)`.

- [ ] **Step 1: Scrivi la migrazione**

```sql
-- web/supabase/migrations/20260821162929_nominative_responses.sql

create table public.nominative_responses (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  question_id text not null,
  answer jsonb not null,
  updated_at timestamptz not null default now(),
  unique (submission_id, question_id)
);

comment on table public.nominative_responses is
  'Valore CORRENTE di ogni risposta della fase nominativa, una riga per domanda per compilazione. Lo storico delle sovrascritture è in nominative_responses_history (Task 4).';

create trigger trg_nominative_responses_updated_at
before update on public.nominative_responses
for each row
execute function public.set_updated_at();
```

- [ ] **Step 2: Verifica manuale**

Sostituisci `<submission_id>` con l'id restituito dall'insert del Task 2:

```sql
insert into public.nominative_responses (submission_id, question_id, answer)
values ('<submission_id>', 'clima', '"soleggiato"')
returning id, updated_at;
-- Expected: 1 riga

insert into public.nominative_responses (submission_id, question_id, answer)
values ('<submission_id>', 'clima', '"piovoso"');
-- Expected: ERROR: duplicate key value violates unique constraint "nominative_responses_submission_id_question_id_key"

select updated_at from public.nominative_responses where question_id = 'clima';
-- annota il valore, poi:

update public.nominative_responses set answer = '"piovoso"'
where submission_id = '<submission_id>' and question_id = 'clima';

select updated_at from public.nominative_responses where question_id = 'clima';
-- Expected: updated_at è cambiato rispetto al valore annotato prima
```

- [ ] **Step 3: Commit**

```bash
git add web/supabase/migrations/20260821162929_nominative_responses.sql
git commit -m "feat(db): add nominative_responses table migration"
```

---

### Task 4: Tabella `nominative_responses_history` + trigger di storico

**Files:**
- Create: `web/supabase/migrations/20260821162930_nominative_responses_history.sql`

**Interfaces:**
- Consumes: `public.nominative_responses` (Task 3), `public.submissions` (Task 2).
- Produces: tabella `public.nominative_responses_history(id, submission_id, question_id, previous_answer, replaced_at)`; funzione `public.log_nominative_response_history()`; trigger `trg_log_nominative_response_history` che, ad ogni `UPDATE` di `nominative_responses.answer`, salva il valore precedente e aggiorna `submissions.last_edited_at`.

- [ ] **Step 1: Scrivi la migrazione**

```sql
-- web/supabase/migrations/20260821162930_nominative_responses_history.sql

create table public.nominative_responses_history (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  question_id text not null,
  previous_answer jsonb not null,
  replaced_at timestamptz not null default now()
);

comment on table public.nominative_responses_history is
  'Storico append-only: una riga per ogni sovrascrittura di nominative_responses, con il valore PRECEDENTE alla modifica. Popolata solo dal trigger sotto, nessuna scrittura applicativa diretta prevista.';

create or replace function public.log_nominative_response_history()
returns trigger
language plpgsql
as $$
begin
  insert into public.nominative_responses_history (submission_id, question_id, previous_answer, replaced_at)
  values (old.submission_id, old.question_id, old.answer, now());

  update public.submissions
  set last_edited_at = now()
  where id = old.submission_id;

  return new;
end;
$$;

comment on function public.log_nominative_response_history is
  'Trigger BEFORE UPDATE su nominative_responses: se answer cambia, salva il valore precedente in nominative_responses_history e aggiorna submissions.last_edited_at nella stessa transazione.';

create trigger trg_log_nominative_response_history
before update on public.nominative_responses
for each row
when (old.answer is distinct from new.answer)
execute function public.log_nominative_response_history();
```

- [ ] **Step 2: Verifica manuale**

Continuando dai dati del Task 3 (`submission_id`/`question_id = 'clima'`,
valore corrente `"piovoso"`):

```sql
update public.nominative_responses set answer = '"temporalesco"'
where submission_id = '<submission_id>' and question_id = 'clima';

select question_id, previous_answer, replaced_at
from public.nominative_responses_history
where submission_id = '<submission_id>';
-- Expected: 1 riga, question_id='clima', previous_answer='"piovoso"' (il valore PRIMA di questo update)

select last_edited_at from public.submissions where id = '<submission_id>';
-- Expected: popolato, vicino a now()

-- un update che non cambia il valore non deve generare storico
update public.nominative_responses set answer = '"temporalesco"'
where submission_id = '<submission_id>' and question_id = 'clima';

select count(*) from public.nominative_responses_history where submission_id = '<submission_id>';
-- Expected: ancora 1 (nessuna nuova riga, perché old.answer is distinct from new.answer è false)
```

- [ ] **Step 3: Commit**

```bash
git add web/supabase/migrations/20260821162930_nominative_responses_history.sql
git commit -m "feat(db): add nominative_responses_history table and audit trigger"
```

---

### Task 5: Tabella `anonymous_tokens`

**Files:**
- Create: `web/supabase/migrations/20260821162931_anonymous_tokens.sql`

**Interfaces:**
- Consumes: `public.survey_campaigns(id)` (Task 1).
- Produces: tabella `public.anonymous_tokens(id, campaign_id, user_id, pseudonym_id, created_at)`, `UNIQUE(user_id, campaign_id)`, `UNIQUE(pseudonym_id)`.

- [ ] **Step 1: Scrivi la migrazione**

```sql
-- web/supabase/migrations/20260821162931_anonymous_tokens.sql

create table public.anonymous_tokens (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.survey_campaigns(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  pseudonym_id text not null unique,
  created_at timestamptz not null default now(),
  unique (user_id, campaign_id)
);

comment on table public.anonymous_tokens is
  'Collega user_id a pseudonym_id, SOLO per garantire una compilazione anonima per utente per campagna (UNIQUE su user_id+campaign_id). Accesso ristretto al service_role (vedi Task 7) — mai esposta a hr_admin o a qualunque client autenticato.';
```

- [ ] **Step 2: Verifica manuale**

```sql
insert into public.anonymous_tokens (campaign_id, user_id, pseudonym_id)
values ('<campaign_id>', '<user_id>', 'ps_abc123')
returning id, created_at;
-- Expected: 1 riga

insert into public.anonymous_tokens (campaign_id, user_id, pseudonym_id)
values ('<campaign_id>', '<user_id>', 'ps_def456');
-- Expected: ERROR: duplicate key value violates unique constraint "anonymous_tokens_user_id_campaign_id_key"
-- (fallisce anche con un pseudonym_id diverso: è questo il vincolo che garantisce "fase anonima non ripetibile")
```

- [ ] **Step 3: Commit**

```bash
git add web/supabase/migrations/20260821162931_anonymous_tokens.sql
git commit -m "feat(db): add anonymous_tokens table migration"
```

---

### Task 6: Tabella `anonymous_responses`

**Files:**
- Create: `web/supabase/migrations/20260821162932_anonymous_responses.sql`

**Interfaces:**
- Consumes: `public.anonymous_tokens(pseudonym_id)` (Task 5).
- Produces: tabella `public.anonymous_responses(id, pseudonym_id, question_id, answer, created_at)`, `UNIQUE(pseudonym_id, question_id)`.

- [ ] **Step 1: Scrivi la migrazione**

```sql
-- web/supabase/migrations/20260821162932_anonymous_responses.sql

create table public.anonymous_responses (
  id uuid primary key default gen_random_uuid(),
  pseudonym_id text not null references public.anonymous_tokens(pseudonym_id) on delete restrict,
  question_id text not null,
  answer jsonb not null,
  created_at timestamptz not null default now(),
  unique (pseudonym_id, question_id)
);

comment on table public.anonymous_responses is
  'Risposte della fase anonima. Nessuna colonna user_id: non collegabile a una persona nemmeno indirettamente. Immutabile: solo INSERT previsto, nessun UPDATE.';
```

- [ ] **Step 2: Verifica manuale**

```sql
insert into public.anonymous_responses (pseudonym_id, question_id, answer)
values ('ps_abc123', 'q_profilo_1', '"opzione_a"')
returning id, created_at;
-- Expected: 1 riga

insert into public.anonymous_responses (pseudonym_id, question_id, answer)
values ('ps_abc123', 'q_profilo_1', '"opzione_b"');
-- Expected: ERROR: duplicate key value violates unique constraint "anonymous_responses_pseudonym_id_question_id_key"

insert into public.anonymous_responses (pseudonym_id, question_id, answer)
values ('ps_nonexistent', 'q_profilo_1', '"x"');
-- Expected: ERROR: insert or update on table "anonymous_responses" violates foreign key constraint
```

- [ ] **Step 3: Commit**

```bash
git add web/supabase/migrations/20260821162932_anonymous_responses.sql
git commit -m "feat(db): add anonymous_responses table migration"
```

---

### Task 7: Row Level Security su tutte le tabelle

**Files:**
- Create: `web/supabase/migrations/20260821162933_rls_policies.sql`

**Interfaces:**
- Consumes: tutte le tabelle dei Task 1-6; ruoli JWT (`auth.jwt() -> 'app_metadata' ->> 'role'`) già definiti in `web/src/lib/auth/routeAccess.ts` (`employee`, `hr_admin`).
- Produces: RLS abilitata su tutte le tabelle; funzione `public.can_write_nominative_response(uuid) returns boolean`, riusata dalle policy INSERT/UPDATE di `nominative_responses`.

- [ ] **Step 1: Scrivi la migrazione**

```sql
-- web/supabase/migrations/20260821162933_rls_policies.sql

-- =========================================================================
-- anonymous_tokens e anonymous_responses: RLS abilitata SENZA alcuna policy
-- per i ruoli authenticated/anon. È intenzionale: nessuna richiesta
-- autenticata dal client (employee o hr_admin) può leggere o scrivere
-- queste due tabelle. Solo il service_role (usato esclusivamente da codice
-- server-side fidato, mai esposto al browser) può toccarle, perché in
-- Supabase service_role bypassa RLS di default. Questo garantisce che il
-- collegamento utente -> pseudonimo non sia mai raggiungibile da una query
-- lato client, nemmeno per un bug in altre policy.
-- =========================================================================

alter table public.survey_campaigns enable row level security;
alter table public.submissions enable row level security;
alter table public.nominative_responses enable row level security;
alter table public.nominative_responses_history enable row level security;
alter table public.anonymous_tokens enable row level security;
alter table public.anonymous_responses enable row level security;

-- ---- survey_campaigns ----

create policy "campaigns_select_authenticated"
on public.survey_campaigns for select
to authenticated
using (true);

create policy "campaigns_write_hr_admin"
on public.survey_campaigns for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'hr_admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'hr_admin');

-- ---- submissions ----

create policy "submissions_select_own"
on public.submissions for select
to authenticated
using (user_id = auth.uid());

create policy "submissions_insert_own_in_window"
on public.submissions for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.survey_campaigns c
    where c.id = campaign_id
      and now() between c.compilation_window_start and c.compilation_window_end
  )
);

create policy "submissions_update_own"
on public.submissions for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- ---- funzione condivisa: può scrivere una risposta nominativa ora? ----
-- True se: la compilazione è "in_progress" ed è dentro la finestra di
-- compilazione della campagna, OPPURE è già "submitted" e la campagna ha
-- una finestra di modifica aperta (edit_window_*) che include "now()".

create or replace function public.can_write_nominative_response(p_submission_id uuid)
returns boolean
language sql
stable
security invoker
as $$
  select exists (
    select 1
    from public.submissions s
    join public.survey_campaigns c on c.id = s.campaign_id
    where s.id = p_submission_id
      and s.user_id = auth.uid()
      and (
        (s.status = 'in_progress'
          and now() between c.compilation_window_start and c.compilation_window_end)
        or (s.status = 'submitted'
          and c.edit_window_start is not null
          and now() between c.edit_window_start and c.edit_window_end)
      )
  );
$$;

comment on function public.can_write_nominative_response is
  'True se l''utente autenticato può scrivere una risposta per questa submission ora: compilazione in corso dentro la finestra di compilazione, oppure già inviata e dentro la finestra di modifica aperta da HR.';

-- ---- nominative_responses ----

create policy "nominative_responses_select_own"
on public.nominative_responses for select
to authenticated
using (
  exists (select 1 from public.submissions s where s.id = submission_id and s.user_id = auth.uid())
);

create policy "nominative_responses_insert_own_in_window"
on public.nominative_responses for insert
to authenticated
with check (public.can_write_nominative_response(submission_id));

create policy "nominative_responses_update_own_in_window"
on public.nominative_responses for update
to authenticated
using (public.can_write_nominative_response(submission_id))
with check (public.can_write_nominative_response(submission_id));

-- ---- nominative_responses_history ----
-- Nota: il trigger del Task 4 gira come SECURITY INVOKER (default), quindi
-- il suo INSERT nello storico è a sua volta soggetto a RLS con i privilegi
-- della sessione che ha eseguito l'UPDATE originale — serve quindi una
-- policy INSERT per authenticated, altrimenti il trigger stesso violerebbe
-- la RLS quando un employee modifica una risposta.

create policy "nominative_responses_history_select_own"
on public.nominative_responses_history for select
to authenticated
using (
  exists (select 1 from public.submissions s where s.id = submission_id and s.user_id = auth.uid())
);

create policy "nominative_responses_history_insert_via_trigger"
on public.nominative_responses_history for insert
to authenticated
with check (
  exists (select 1 from public.submissions s where s.id = submission_id and s.user_id = auth.uid())
);

-- anonymous_tokens e anonymous_responses: nessuna policy per authenticated/anon
-- (vedi commento in testa al file) — solo service_role vi accede.
```

- [ ] **Step 2: Verifica manuale**

Questa verifica richiede due sessioni autenticate distinte (due utenti Supabase
Auth di test, uno con `app_metadata.role = 'employee'`, l'altro con
`'hr_admin'`), usando il client anon-key con il loro rispettivo JWT (es. da
`supabase.auth.signInWithPassword` in una console, non con la service-role
key che bypassa sempre RLS):

```sql
-- Come employee A: crea la propria submission (deve riuscire se dentro compilation_window)
insert into public.submissions (campaign_id, user_id) values ('<campaign_id>', '<employee_a_id>');

-- Come employee A: legge la propria submission
select * from public.submissions where user_id = '<employee_a_id>';
-- Expected: 1 riga

-- Come employee B: NON deve vedere la submission di employee A
select * from public.submissions where user_id = '<employee_a_id>';
-- Expected: 0 righe (RLS nega, anche se la query è sintatticamente valida)

-- Come employee A: tenta di scrivere una risposta con submission status='submitted'
-- e la campagna SENZA edit_window aperta
update public.nominative_responses set answer = '"x"'
where submission_id = '<submission_a_id>' and question_id = 'clima';
-- Expected: 0 righe aggiornate (RLS nega silenziosamente via WITH CHECK/USING),
-- non un errore SQL — verificare con una SELECT successiva che il valore non sia cambiato

-- Come hr_admin: tenta di leggere le submission (deve fallire/restituire 0 righe)
select * from public.submissions;
-- Expected: 0 righe — hr_admin non ha nessuna policy che gli dia accesso a questa tabella

-- Come hr_admin: aggiorna una campagna (deve riuscire)
update public.survey_campaigns set edit_window_start = now(), edit_window_end = now() + interval '7 days'
where id = '<campaign_id>';
-- Expected: 1 riga aggiornata

-- Come employee A: ora che l'edit_window è aperta e la sua submission è 'submitted',
-- la modifica deve riuscire
update public.nominative_responses set answer = '"piovoso"'
where submission_id = '<submission_a_id>' and question_id = 'clima';
-- Expected: 1 riga aggiornata, e una nuova riga in nominative_responses_history

-- Nessun ruolo authenticated deve poter leggere anonymous_tokens
select * from public.anonymous_tokens;
-- Expected: 0 righe per qualunque utente (employee o hr_admin)
```

- [ ] **Step 3: Commit**

```bash
git add web/supabase/migrations/20260821162933_rls_policies.sql
git commit -m "feat(db): enable RLS and add access policies for all survey tables"
```

---

### Task 8: Helper TypeScript per le finestre di campagna

**Files:**
- Create: `web/src/lib/campaigns/windows.ts`
- Test: `web/tests/lib/campaigns-windows.test.ts`

**Interfaces:**
- Consumes: nessuna dipendenza da altri task (funzioni pure, nessuna chiamata a Supabase).
- Produces:
  - `type SurveyCampaignWindow = { compilation_window_start: string; compilation_window_end: string; edit_window_start: string | null; edit_window_end: string | null }`
  - `isCompilationOpen(campaign: SurveyCampaignWindow, now: Date): boolean`
  - `isEditOpen(campaign: SurveyCampaignWindow, now: Date): boolean`

  Questo modulo rispecchia in TypeScript la stessa logica di
  `can_write_nominative_response` (Task 7): permette al frontend di
  mostrare/nascondere UI di compilazione/modifica senza fare una query,
  mentre l'enforcement reale resta lato DB (RLS) — coerente con la decisione
  di design "frontend inibisce l'esperienza, il DB garantisce la regola".

- [ ] **Step 1: Scrivi i test (falliranno perché il modulo non esiste)**

```typescript
// web/tests/lib/campaigns-windows.test.ts
import { describe, expect, it } from 'vitest'
import { isCompilationOpen, isEditOpen, type SurveyCampaignWindow } from '../../src/lib/campaigns/windows'

const baseCampaign: SurveyCampaignWindow = {
  compilation_window_start: '2026-01-01T00:00:00.000Z',
  compilation_window_end: '2026-01-31T23:59:59.000Z',
  edit_window_start: null,
  edit_window_end: null,
}

describe('isCompilationOpen', () => {
  it('returns true when now is inside the compilation window', () => {
    const now = new Date('2026-01-15T12:00:00.000Z')
    expect(isCompilationOpen(baseCampaign, now)).toBe(true)
  })

  it('returns false when now is before the compilation window', () => {
    const now = new Date('2025-12-31T23:59:59.000Z')
    expect(isCompilationOpen(baseCampaign, now)).toBe(false)
  })

  it('returns false when now is after the compilation window', () => {
    const now = new Date('2026-02-01T00:00:00.000Z')
    expect(isCompilationOpen(baseCampaign, now)).toBe(false)
  })

  it('treats the window boundaries as inclusive', () => {
    const start = new Date(baseCampaign.compilation_window_start)
    const end = new Date(baseCampaign.compilation_window_end)
    expect(isCompilationOpen(baseCampaign, start)).toBe(true)
    expect(isCompilationOpen(baseCampaign, end)).toBe(true)
  })
})

describe('isEditOpen', () => {
  it('returns false when no edit window is set', () => {
    const now = new Date('2026-01-15T12:00:00.000Z')
    expect(isEditOpen(baseCampaign, now)).toBe(false)
  })

  it('returns true when now is inside a configured edit window', () => {
    const campaign: SurveyCampaignWindow = {
      ...baseCampaign,
      edit_window_start: '2026-03-01T00:00:00.000Z',
      edit_window_end: '2026-03-07T23:59:59.000Z',
    }
    const now = new Date('2026-03-03T00:00:00.000Z')
    expect(isEditOpen(campaign, now)).toBe(true)
  })

  it('returns false when now is outside a configured edit window', () => {
    const campaign: SurveyCampaignWindow = {
      ...baseCampaign,
      edit_window_start: '2026-03-01T00:00:00.000Z',
      edit_window_end: '2026-03-07T23:59:59.000Z',
    }
    const now = new Date('2026-04-01T00:00:00.000Z')
    expect(isEditOpen(campaign, now)).toBe(false)
  })
})
```

- [ ] **Step 2: Esegui i test e verifica che falliscano**

Run: `cd web && npm run test -- campaigns-windows`
Expected: FAIL con errore di risoluzione modulo (`Cannot find module '../../src/lib/campaigns/windows'`)

- [ ] **Step 3: Implementa il modulo**

```typescript
// web/src/lib/campaigns/windows.ts

export type SurveyCampaignWindow = {
  compilation_window_start: string
  compilation_window_end: string
  edit_window_start: string | null
  edit_window_end: string | null
}

export function isCompilationOpen(campaign: SurveyCampaignWindow, now: Date): boolean {
  const start = new Date(campaign.compilation_window_start)
  const end = new Date(campaign.compilation_window_end)
  return now >= start && now <= end
}

export function isEditOpen(campaign: SurveyCampaignWindow, now: Date): boolean {
  if (!campaign.edit_window_start || !campaign.edit_window_end) {
    return false
  }
  const start = new Date(campaign.edit_window_start)
  const end = new Date(campaign.edit_window_end)
  return now >= start && now <= end
}
```

- [ ] **Step 4: Esegui i test e verifica che passino**

Run: `cd web && npm run test -- campaigns-windows`
Expected: PASS, 6 test superati

- [ ] **Step 5: Esegui l'intera suite per verificare che non ci siano regressioni**

Run: `cd web && npm run test`
Expected: PASS, tutti i test esistenti + i 6 nuovi

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/campaigns/windows.ts web/tests/lib/campaigns-windows.test.ts
git commit -m "feat: add pure campaign compilation/edit window helpers"
```

---

## Prossimi passi (fuori scope di questo piano)

- Wiring delle API routes che useranno queste tabelle per persistere le
  risposte reali di `SurveyApp` (oggi solo in stato React in memoria) — piano
  separato, dipende da questo schema essendo applicato a un progetto
  Supabase reale.
- Viste aggregate + UI dashboard HR (soglia minima 5 risposte) — da
  scoping funzionale con HR prima di poter essere pianificate (vedi
  `docs/architettura-proposta-pilota.md` sezione 4).
- Provisioning reale utenti (flusso di invito Supabase Auth) e
  configurazione `app_metadata.role`.
