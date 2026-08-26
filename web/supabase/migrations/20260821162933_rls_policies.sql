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

alter table public.survey_campaigns force row level security;
alter table public.submissions force row level security;
alter table public.nominative_responses force row level security;
alter table public.nominative_responses_history force row level security;
alter table public.anonymous_tokens force row level security;
alter table public.anonymous_responses force row level security;

revoke all on public.anonymous_tokens, public.anonymous_responses from anon, authenticated;

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

-- Le policy sopra sono per-riga: senza restrizioni di colonna, un utente
-- potrebbe comunque cambiare campaign_id o status della propria riga via
-- UPDATE (bypassando la finestra di modifica o "riassegnando" la
-- compilazione a un'altra campagna). I GRANT per colonna sotto si
-- compongono con le policy RLS sopra: la riga deve comunque passare RLS,
-- E il client può scrivere solo le colonne elencate qui.
revoke update on public.submissions from authenticated;
grant update (status, submitted_at) on public.submissions to authenticated;

-- ---- funzione condivisa: può scrivere una risposta nominativa ora? ----
-- True se: la compilazione è "in_progress" ed è dentro la finestra di
-- compilazione della campagna, OPPURE è già "submitted" e la campagna ha
-- una finestra di modifica aperta (edit_window_*) che include "now()".
--
-- IMPORTANTE per chi scriverà il codice applicativo: l'ordine di scrittura
-- corretto per una prima compilazione è:
--   1. INSERT in submissions con status='in_progress' (default)
--   2. INSERT/UPDATE delle risposte in nominative_responses (permesso
--      perché status è 'in_progress' ed è dentro la finestra di
--      compilazione)
--   3. solo alla fine, UPDATE submissions set status='submitted',
--      submitted_at=now()
-- Creare la submission già con status='submitted' e poi tentare di
-- scrivere le risposte FALLISCE (RLS nega l'insert, perché la funzione
-- sotto richiede una edit_window aperta per le submission già 'submitted').

create or replace function public.can_write_nominative_response(p_submission_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public, pg_temp
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

-- Stesso motivo del blocco su submissions: senza restrizione di colonna,
-- un utente potrebbe ri-agganciare la propria risposta a un'altra
-- submission_id o cambiare question_id via UPDATE.
revoke update on public.nominative_responses from authenticated;
grant update (answer) on public.nominative_responses to authenticated;

-- ---- nominative_responses_history ----
-- Nota: la funzione trigger del Task 4 (log_nominative_response_history)
-- gira come SECURITY DEFINER, quindi il suo INSERT nello storico bypassa
-- del tutto la RLS, indipendentemente dai privilegi della sessione che ha
-- eseguito l'UPDATE originale. Per questo NON esiste (e non deve esistere)
-- nessuna policy INSERT su questa tabella per authenticated/anon: nessun
-- client può scrivere direttamente in nominative_responses_history, solo il
-- trigger può farlo. Questo preserva l'integrità dello storico come audit
-- trail, evitando che un employee possa inserire righe di storico fabbricate
-- chiamando direttamente le API REST di Supabase.

create policy "nominative_responses_history_select_own"
on public.nominative_responses_history for select
to authenticated
using (
  exists (select 1 from public.submissions s where s.id = submission_id and s.user_id = auth.uid())
);

-- Revoke INSERT/UPDATE/DELETE to keep SELECT (used by nominative_responses_history_select_own)
-- but ensure only the SECURITY DEFINER trigger from Task 4 can ever write history rows
revoke insert, update, delete on public.nominative_responses_history from anon, authenticated;

-- anonymous_tokens e anonymous_responses: nessuna policy per authenticated/anon
-- (vedi commento in testa al file) — solo service_role vi accede.
