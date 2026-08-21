# Struttura del database — Open Listening · Active Care — Design

> **Stato:** approvato dall'utente in chat, in scrittura del piano di implementazione.
> **Ambito:** schema dati (tabelle, chiavi, vincoli) per persistere le compilazioni
> del survey, con supporto a campagne ricorrenti, modifica tracciata della fase
> nominativa e non-ripetibilità della fase anonima. Non tratta in dettaglio le
> policy RLS SQL né le API — quelle sono oggetto del piano di implementazione
> successivo, ma ogni vincolo qui descritto è pensato per essere applicato a
> livello DB (constraint), non solo applicativo.

## 1. Contesto e vincoli di partenza

Riprende e completa il modello dati già ipotizzato in
`docs/architettura-proposta-pilota.md` (sezione 6), aggiungendo quanto emerso
in questa sessione di brainstorming:

1. La fase nominativa (oggi: Nome/Cognome manuale) sarà in futuro legata
   all'identità autenticata (già oggi via Supabase Auth email/password, con
   eventuale evoluzione a login Google aziendale — indifferente per lo
   schema, che si aggancia sempre a `auth.users.id`).
2. La fase anonima non deve mai essere collegabile all'utente che l'ha
   compilata.
3. Ogni compilazione nominativa ha un identificativo (GUID) di riferimento.
4. Le compilazioni sono univoche per utente **per campagna** (non in
   assoluto — il survey può ripetersi, es. ogni anno).
5. Le modifiche alla fase nominativa vanno tracciate in uno storico.
6. Una volta completata la fase anonima, non deve essere possibile
   ricompilarla per la stessa campagna — nemmeno passando per una modifica
   della fase nominativa.
7. Il survey è pensato come **ricorrente** (campagne/edizioni nel tempo, es.
   annuali), non solo come pilota una tantum.
8. La compilazione e la modifica sono governate da **due finestre temporali
   indipendenti**, attivabili da HR dalla dashboard: la finestra di
   compilazione (prima compilazione/completamento) e la finestra di modifica
   (correzioni successive, aperta da HR quando necessario, anche molto dopo
   la chiusura della compilazione).
9. Il database attuale è Postgres su Supabase, ma lo stack finale non è
   deciso (possibile SQL/MySQL) — lo schema logico deve restare portabile.

## 2. Campagne e finestre temporali

```sql
survey_campaigns
  id                          uuid PK
  name                        text            -- es. "Open Listening 2026"
  compilation_window_start    timestamptz
  compilation_window_end      timestamptz
  edit_window_start           timestamptz null  -- null = modifiche non attive
  edit_window_end             timestamptz null
  created_at                  timestamptz
  updated_at                  timestamptz
```

- Ogni compilazione (nominativa e anonima) appartiene a una `campaign_id`.
- Le due finestre sono scorrelate: la `compilation_window` governa se si può
  iniziare/completare per la prima volta il nominativo; la `edit_window` —
  vuota di default — governa se si possono correggere compilazioni già
  inviate, indipendentemente da quanto tempo sia passato dalla chiusura della
  compilazione.
- Gestione della tabella: scrittura riservata a `hr_admin` (dalla dashboard),
  lettura delle date disponibile anche a `employee` (per mostrare se il
  survey/le modifiche sono aperte).

## 3. Fase nominativa — compilazione, GUID, modifica, storico

```sql
submissions
  id              uuid PK           -- il GUID, riferimento della compilazione
  campaign_id     uuid FK -> survey_campaigns(id)
  user_id         uuid FK -> auth.users(id)
  status          text              -- 'in_progress' | 'submitted'
  submitted_at    timestamptz null
  last_edited_at  timestamptz null
  created_at      timestamptz
  UNIQUE(user_id, campaign_id)      -- una compilazione per utente per campagna

nominative_responses               -- valore CORRENTE, una riga per domanda
  id             uuid PK
  submission_id  uuid FK -> submissions(id)
  question_id    text
  answer         jsonb
  updated_at     timestamptz
  UNIQUE(submission_id, question_id)

nominative_responses_history       -- popolata via trigger prima di ogni UPDATE
  id              uuid PK
  submission_id   uuid FK -> submissions(id)
  question_id     text
  previous_answer jsonb
  replaced_at     timestamptz default now()
```

- Al primo completamento, l'app crea `submissions` (`status = 'submitted'`,
  `submitted_at = now()`) e le righe corrispondenti in
  `nominative_responses`.
- Il GUID (`submissions.id`) viene mostrato al dipendente come riferimento
  della propria compilazione (schermata di conferma finale), **non** come
  token d'accesso: l'apertura di una vista di modifica resta sempre dietro
  login, verificando lato server che `user_id = auth.uid()` per quel GUID.
- Una modifica (`UPDATE` su `nominative_responses`) è permessa solo se
  `now()` cade nella `edit_window` della campagna collegata — controllo
  **server-side**, non solo nascosto nel frontend.
- Ogni `UPDATE` su `nominative_responses` fa scattare un trigger che copia il
  valore precedente in `nominative_responses_history` prima di sovrascrivere:
  storico completo delle modifiche, mentre le query correnti (dashboard,
  rendering) restano semplici perché leggono solo `nominative_responses`.

## 4. Fase anonima — nessun collegamento all'utente, non ripetibile

```sql
anonymous_tokens                    -- SOLO per garantire "una volta per campagna"
  id           uuid PK
  campaign_id  uuid FK -> survey_campaigns(id)
  user_id      uuid FK -> auth.users(id)   -- accesso ristretto: solo ruolo di sistema, mai hr_admin
  pseudonym_id text UNIQUE
  created_at   timestamptz
  UNIQUE(user_id, campaign_id)

anonymous_responses                 -- nessuna colonna user_id, mai
  id           uuid PK
  pseudonym_id text FK -> anonymous_tokens(pseudonym_id)
  question_id  text
  answer       jsonb
  created_at   timestamptz
  UNIQUE(pseudonym_id, question_id)
```

- All'ingresso nella fase anonima, il backend verifica se esiste già una riga
  in `anonymous_tokens` per `(user_id, campaign_id)`. Se esiste → blocca
  l'accesso (redirect a schermata "fase già completata"), nessun nuovo
  `pseudonym_id` viene generato, quindi è impossibile scrivere una seconda
  volta in `anonymous_responses` per la stessa persona nella stessa
  campagna. Il controllo vale sia per il flusso normale (prima compilazione)
  sia per un rientro nell'app dopo una modifica del nominativo.
- Il frontend, in modalità "modifica di una compilazione già inviata", non
  mostra affatto la fase anonima — ma il vincolo reale, quello che non può
  essere bypassato, è il controllo server-side sopra descritto più il
  vincolo `UNIQUE(user_id, campaign_id)` a livello DB.
- `anonymous_responses` è **immutabile**: nessun `UPDATE`, nessuna history —
  una volta scritta una risposta anonima resta così per sempre, coerente col
  vincolo che la fase anonima non è mai editabile.
- `anonymous_tokens` ha RLS che la rende illeggibile a `hr_admin`: nessuna
  query di dashboard può risalire da un `pseudonym_id` a un `user_id`.

## 5. Riepilogo vincoli DB che garantiscono le regole richieste

| Regola richiesta | Garantita da |
|---|---|
| Una compilazione per utente per campagna | `UNIQUE(user_id, campaign_id)` su `submissions` |
| Modifica solo nella finestra aperta da HR | Check server-side su `edit_window`, non solo frontend |
| Storico delle modifiche nominative | Trigger → `nominative_responses_history` |
| Fase anonima mai ripetibile nella stessa campagna | `UNIQUE(user_id, campaign_id)` su `anonymous_tokens`, verificato prima di generare `pseudonym_id` |
| Fase anonima mai collegabile all'utente | Nessuna colonna `user_id` in `anonymous_responses`; `anonymous_tokens` illeggibile da `hr_admin` |
| Survey ricorrente (edizioni future) | Tutto scoping via `campaign_id`, nessuna tabella "singleton" |

## 6. Portabilità (Supabase → eventuale SQL/MySQL)

- Tutte le colonne usano tipi standard SQL (`uuid`/`char(36)`,
  `timestamptz`/`timestamp`, `jsonb`/`json` — MySQL ha `JSON` nativo, la
  sintassi cambia ma il modello logico no).
- I trigger di history sono SQL standard (Postgres e MySQL li supportano
  entrambi, con sintassi diversa ma stesso concetto: copiare la riga
  precedente prima dell'`UPDATE`).
- L'unico pezzo non portabile 1:1 è la **RLS di Postgres/Supabase**: se si
  migra a MySQL, la stessa logica di isolamento (chi può leggere cosa) va
  spostata dal livello RLS al livello applicativo (le API). L'architettura
  già prevede che siano le API, non il frontend, il punto di enforcement
  delle regole di business — quindi il porting è "spostare la regola da RLS
  a codice applicativo", non riprogettare lo schema.

## 7. Fuori scope (rimandato al piano di implementazione)

- Testo SQL esatto delle policy RLS per ogni tabella.
- Definizione delle viste aggregate per la dashboard HR (soglia minima 5
  risposte — già decisa nel progetto, ma le query specifiche sono da
  scoping funzionale con HR, come da `docs/architettura-proposta-pilota.md`
  sezione 4).
- UI della dashboard HR per creare/gestire campagne e aprire le finestre di
  modifica.
- Migrazioni SQL effettive (Supabase migrations) — verranno scritte nel piano
  di implementazione a partire da questo schema logico.
