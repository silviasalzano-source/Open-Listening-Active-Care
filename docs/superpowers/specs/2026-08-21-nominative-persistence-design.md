# Persistenza fase nominativa — Design

> **Stato:** approvato dall'utente in chat, in scrittura del piano di implementazione.
> **Ambito:** collega `SurveyApp` (fase 1, "My Energy Battery") allo schema
> database creato in `docs/superpowers/specs/2026-08-21-database-schema-design.md`
> e implementato in `docs/superpowers/plans/2026-08-21-database-schema-implementation.md`
> (già applicato a un progetto Supabase reale). Oggi le risposte vivono solo
> in stato React (`useState`) e si perdono al refresh — questo piano le rende
> persistenti.
>
> **Fuori scope** (piani separati successivi): persistenza della fase anonima
> (7 capitoli, `anonymous_tokens`/`anonymous_responses`), modifica di una
> compilazione già `submitted` (finestra `edit_window`), dashboard HR.

## 1. Contesto

Lo schema database (campagne, submissions, risposte nominative con storico)
esiste già ed è stato applicato. `SurveyApp.tsx` (client component) gestisce
oggi l'intero flow — fase 1 (4 domande "My Energy Battery") e fase 2 (7
capitoli "Fattori Energy Battery", già implementata a UI ma non persistita)
— interamente in memoria. Questo piano collega **solo la fase 1** al
database: creazione/ripresa della submission, salvataggio incrementale delle
risposte, passaggio automatico a `status = 'submitted'`.

`web/src/app/survey/page.tsx` (Server Component) già fa `requireRole(['employee', 'hr_admin'])`
e conosce l'utente autenticato — è il punto naturale per orchestrare i nuovi
passaggi server-side prima di renderizzare `SurveyApp`.

## 2. Determinare la campagna attiva

In `page.tsx`, prima di renderizzare `SurveyApp`, si cerca la campagna la cui
finestra di compilazione è aperta ora:

```sql
select * from survey_campaigns
where now() between compilation_window_start and compilation_window_end
order by created_at desc
limit 1;
```

(`order by created_at desc limit 1` è una regola deterministica per il caso
limite — improbabile ma possibile — di due campagne con finestre
sovrapposte: vince la più recente.)

Se non c'è nessuna campagna con la finestra aperta, `page.tsx` renderizza
`NoActiveCampaignScreen` invece di `SurveyApp` — nessuna submission viene
creata, nessun errore, solo un messaggio informativo per il dipendente.

## 3. Trovare o creare la submission

Con una campagna attiva e l'utente autenticato, `page.tsx` cerca una riga in
`submissions` per `(user_id, campaign_id)`. Se non esiste, la crea
(`status` di default `'in_progress'`) — il vincolo `UNIQUE(user_id, campaign_id)`
garantisce che non se ne possano creare due, anche in caso di doppia
richiesta concorrente (es. due tab aperte contemporaneamente): la seconda
insert fallisce per violazione del vincolo, e in quel caso si rilegge
semplicemente la riga già creata dalla prima.

Si caricano poi tutte le righe di `nominative_responses` per quella
submission, e si costruisce l'oggetto `Phase1Answers` iniziale da passare a
`SurveyApp` (stessa forma già usata oggi in stato React: `clima`,
`termometro`, `causa`, `causa_altro`, `descrizione`).

## 4. Ripresa (resume) nel flow

Una funzione pura `computeResumeIndex(flow, answers, status)`:
- se `status === 'submitted'`: ritorna l'indice dello step `result` nel flow.
- altrimenti: ritorna l'indice del primo step `kind: 'q1'` il cui
  `question.id` NON è presente in `answers` — saltando eventuali `q1intro`
  intermedi già "superati" (semplificazione esplicita, approvata: se manca
  solo `descrizione`, il popup "concentrati sull'ultimo anno" non viene
  ri-mostrato).
- se `answers` è vuoto: ritorna l'indice dello step `intro` (comportamento
  identico a oggi, nessuna ripresa necessaria).

Isolata in `web/src/lib/survey/resume.ts`, senza dipendenze da Supabase —
testabile con Vitest passando `flow`/`answers`/`status` come dati puri.

## 5. Salvataggio incrementale + passaggio a "submitted"

Nuovo endpoint `POST /api/survey/nominative-answer`, chiamato da `SurveyApp`
al click su "Continua" per ogni domanda della fase 1, con body
`{ submissionId: string, questionId: string, answer: unknown }`:

1. verifica che l'utente sia autenticato (401 altrimenti).
2. `upsert` su `nominative_responses` con `onConflict: 'submission_id,question_id'`
   (il client Supabase server-side usa la sessione dell'utente via cookie,
   quindi le RLS Task 7 si applicano con l'identità reale — se la finestra
   di compilazione non è più aperta, l'upsert viene rifiutato dal DB stesso,
   non solo dal frontend).
3. se l'upsert riesce: conta quante delle 4 `question_id` obbligatorie
   (`clima`, `termometro`, `causa`, `descrizione`) hanno ormai una riga per
   questa submission. Se sono tutte e 4 presenti e `submissions.status` è
   ancora `'in_progress'`, aggiorna la submission a `status = 'submitted'`,
   `submitted_at = now()`, nella stessa richiesta.

`causa_altro` (testo libero della domanda "Altro") viene salvato come riga
separata con `question_id = 'causa_altro'` quando presente — rispecchia 1:1
la struttura già usata in `Phase1Answers`, e non conta tra le 4 domande
obbligatorie per il passaggio a "submitted".

Il conteggio (non un semplice "sei sulla domanda `descrizione`?") rende il
passaggio a `submitted` robusto anche se in futuro cambiasse l'ordine delle
domande in `step1`.

## 6. Comportamento di `SurveyApp` durante il salvataggio

Al click su "Continua" per uno step `q1`, `SurveyApp`:
1. mostra uno stato "salvataggio in corso" (bottone disabilitato).
2. chiama l'endpoint con la risposta corrente.
3. se la chiamata riesce: aggiorna lo stato locale (comportamento già
   esistente) e avanza (`goNext`).
4. se fallisce: mostra un messaggio d'errore con un bottone "Riprova" —
   **nessun avanzamento** finché il salvataggio non riesce (scelta
   approvata: bloccante, coerente con l'aver introdotto il salvataggio
   incrementale proprio per non perdere risposte).

L'errore restituito dall'API distingue (per messaggio, non per logica
applicativa) il caso "finestra di compilazione chiusa nel frattempo" da un
errore di rete/server generico, così il dipendente capisce perché non può
proseguire invece di vedere un errore generico.

## 7. File coinvolti

```
web/src/lib/survey/
  activeCampaign.ts     — getActiveCampaign(supabase): Promise<Campaign | null>
  submission.ts         — getOrCreateSubmission(supabase, userId, campaignId): Promise<Submission>
  resume.ts             — computeResumeIndex(flow, answers, status): number (pura)

web/src/app/api/survey/nominative-answer/route.ts   — POST, upsert + eventuale flip a 'submitted'

web/src/app/survey/page.tsx                          — MODIFICA: orchestrazione
web/src/features/survey/SurveyApp.tsx                — MODIFICA: props iniziali, chiamata API, stato saving/errore
web/src/features/survey/screens/NoActiveCampaignScreen.tsx  — nuovo screen
```

## 8. Testing

- `resume.ts` — unit test puri (Vitest), nessuna dipendenza da Supabase:
  nessuna risposta → `intro`; risposte parziali → prima domanda mancante,
  saltando i `q1intro` intermedi; tutte le risposte con status `submitted`
  → `result`.
- `getActiveCampaign` / `getOrCreateSubmission` / l'endpoint API — non
  testabili in automatico in questo ambiente di sviluppo (nessun Postgres
  locale/CI collegato a un progetto Supabase reale, stesso vincolo già
  affrontato per lo schema database); verifica manuale in browser con
  `npm run dev` contro il progetto Supabase reale già configurato.
- Verifica manuale end-to-end (piano di implementazione, non questo spec):
  compilare la fase 1, interrompere a metà e riaprire per controllare la
  ripresa; verificare il passaggio a `submitted` dopo la 4ª risposta;
  verificare il messaggio quando non c'è campagna attiva; verificare che un
  salvataggio fallito blocchi realmente l'avanzamento.

## 9. Addendum — Nome/Cognome (`NameModal`)

*(Aggiunto dopo l'approvazione iniziale, durante la scrittura del piano di
implementazione: il codice su `main` è nel frattempo cambiato — è stato
reintrodotto il `NameModal` del prototipo originale, che il piano precedente
[2026-08-20-survey-nominative-phase-design.md](2026-08-20-survey-nominative-phase-design.md)
aveva rimosso. Decisione dell'utente: persistere anche questi campi.)*

- `nome` e `cognome` (raccolti dal modal obbligatorio prima della prima
  domanda) vengono salvati come due righe aggiuntive in
  `nominative_responses` (`question_id = 'nome'` / `'cognome'`), con lo
  stesso endpoint `POST /api/survey/nominative-answer` usato per le altre
  domande.
- **Rientrano tra le domande "obbligatorie"** che fanno scattare il
  passaggo a `status = 'submitted'`: l'insieme diventa `nome`, `cognome`,
  `clima`, `termometro`, `causa`, `descrizione` (6 in totale, non più 4).
  Motivo: il gating del modal lato client impedisce già di procedere senza
  compilarli, ma includerli anche nel controllo server-side mantiene la
  stessa difesa in profondità già applicata alle altre domande (il client
  non è l'unica barriera).
- **Ripresa**: se `nome`/`cognome` sono già presenti tra le risposte
  caricate, il modal non viene ri-mostrato al resume — il flow riprende
  direttamente dalla prima domanda `q1` senza risposta (stessa regola della
  sezione 4, dato che il modal non è uno step del `flow` ma uno stato
  separato in `SurveyApp` mostrato solo cliccando "Iniziamo" sull'intro). Se
  invece `nome`/`cognome` NON sono presenti, si riparte sempre dall'intro
  (indice 0), indipendentemente da eventuali risposte `q1` già presenti
  (stato che non dovrebbe verificarsi dato il gating del modal, ma è il
  comportamento di default più sicuro).

## 10. Fuori scope (rimandato)

- Persistenza della fase anonima (7 capitoli) — piano separato.
- Modifica di una compilazione già `submitted` (finestra `edit_window`) —
  piano separato; oggi, se un utente con submission già `submitted` riapre
  `/survey`, vede solo la `result` screen (nessuna scrittura ulteriore
  possibile, coerente con le RLS esistenti).
- UI per la dashboard HR (creazione campagne, apertura finestre) — le
  campagne vanno create manualmente via SQL Editor per ora.
