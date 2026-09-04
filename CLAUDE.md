# CLAUDE.md — Open Listening · Active Care (OT Consulting)

Questo file serve come hand-off per continuare lo sviluppo con Claude Code.
Contiene il contesto del progetto, lo stato attuale, le decisioni prese e i
prossimi passi, così da non dover ripartire da zero.

## 1. Cos'è questo progetto

App di survey aziendale per **OT Consulting**, chiamata
**"Open Listening · Active Care"**. Nata da una consulenza di psicologia HR
(item bank su Excel), è passata da un prototipo HTML cliccabile a un'app
Next.js vera con dashboard HR.

Il repository contiene **due artefatti distinti**:

### 1a. Prototipo HTML (reference, non più il focus principale)

**File:** `Open_Listening_Active_Care_Prototype.html`  
(~1300 righe: CSS in `<style>`, markup in `<body>`, logica in un unico
`<script>` a fondo pagina, vanilla JS, nessuna dipendenza esterna).

Usato per validare UX/UI e come reference per il porting in React. Non
viene più sviluppato attivamente — le modifiche di prodotto vanno fatte
sull'app Next.js in `web/`.

### 1b. App Next.js (sviluppo attivo)

**Cartella:** `web/` — Next.js App Router, TypeScript, Supabase.

Struttura di rilievo:
- `web/src/features/survey/` — flow survey completo portato in React
- `web/src/features/dashboard/` — dashboard "OT Energy" per `hr_admin` /
  `bu_manager` con filtri area/team, metriche aggregate, tab Campagne
- `web/src/lib/auth/` — `requireRole` server-side, ruoli `hr_admin` /
  `bu_manager` via `app_metadata.role` nel JWT Supabase
- `web/src/lib/campaigns/` — logica apertura/chiusura finestre di campagna
- `web/supabase/migrations/` — schema SQL pronto (campaigns, submissions,
  risposte nominative/anonime, RLS policy, indici), da applicare via
  SQL Editor di Supabase
- `web/README.md` — istruzioni di setup, test e deploy

**Stato attuale** (settembre 2026): survey e dashboard UI sono completi;
la dashboard usa ancora dati mock deterministici (localStorage); l'integrazione
Supabase reale (lettura/scrittura risposte via API routes) è il prossimo
passo tecnico aperto.

Esiste anche un item bank Excel (`Survey_Battery_Item_Bank_v19.xlsx`)
con le domande "ufficiali" — utile come riferimento per verificare la
formulazione esatta.

## 2. Flusso complessivo dell'app

L'app è un'unica pagina che renderizza "schermate" (`screens`) in sequenza
dentro un contenitore che simula un telefono (`device-frame`), con un toggle
in alto per passare a vista "sito web" (desktop) — puramente estetico, stesso
markup.

Sequenza logica (vedi `buildFlow()` in JS):

1. **Intro** — logo OT Consulting, titolo, CTA "Iniziamo" → apre un **modal**
   "Prima di iniziare" (badge "Nominativo") con campi Nome/Cognome
   obbligatori. Al click su "Ho capito, inizio" si passa alla prima domanda.
2. **My Energy Battery** (fase *nominativa*, tema caldo/ambra) — 4 domande:
   - `clima` — "Che tempo fa nel tuo team?" (single-icon: Soleggiato /
     Parzialmente nuvoloso / Piovoso / Temporalesco)
   - **[popup]** *"Ora ti chiediamo di concentrarti sul clima attuale del tuo
     team"* con animazione di più mascotte-batteria che interagiscono
   - `termometro` — slider 1-10 con mascotte animata (faccina che cambia
     espressione in base al livello) + messaggio testuale per ogni valore
   - `causa` — "Cosa influenza di più la tua energia ora?" (multi-icon, max 2,
     con opzione "Altro" a testo libero)
   - **[popup]** *"Ora ti chiediamo di concentrarti sul tuo ultimo anno"* con
     animazione a tema "ciclo delle stagioni"
   - `descrizione` — "Come descriveresti la tua energia quest'anno?"
     (Crescita / Stabile / Ricarica / Assestamento)
   - Le prime 3 domande mostrano un badge "OGGI" in alto a destra
     nell'eyebrow; l'ultima mostra "ULTIMO ANNO".
3. **Result screen** ("My Energy Battery" con titolo brand in gradiente) —
   sintesi qualitativa (NON numerica) generata combinando le risposte delle 4
   domande precedenti, con mascotte "hero" e micro-interazioni (coriandoli se
   energia alta, alone calmo se energia bassa). Bottone "Prosegui".
4. **Transition screen** — "Da qui in poi..." con lucchetto animato, spiega
   che si passa alla fase anonima. Bottone "Continua in anonimato".
5. **Fattori Energy Battery** (fase *anonima*, tema freddo/teal) — 22 domande
   raggruppate in **7 capitoli**, ciascuno preceduto da una schermata di
   anticipazione con mascotte animata a tema, poi UNA sola schermata con
   TUTTE le domande del capitolo insieme (non una per volta), con bottoni
   "Indietro" + "Continua" (quest'ultimo disabilitato finché non sono
   risposte tutte le domande obbligatorie del capitolo).
6. **End screen** — "Completato!" con illustrazione di due mascotte HR
   animate (pollice in su, coriandoli, badge "100%" stile videogioco).

## 3. Struttura dati (JS)

Tutto è definito come array/oggetti JS in cima allo `<script>`:

```js
const step1 = [ /* 4 domande "My Energy Battery", vedi sopra */ ];

const chapters = {
  profilo:    { mascot:'commute',  title:'Area e ruolo', ... },
  relazioni:  { mascot:'talk',     title:'Le tue relazioni sul lavoro', ... },
  crescita:   { mascot:'growth',   title:'Autonomia e crescita', ... },
  valori:     { mascot:'tech',     title:'Tecnologia e Valori', ... },
  energia2:   { mascot:'flow',     title:'Carico ed energia', ... },
  riflessione:{ mascot:'timeline', title:'Prospettive', ... },
  chiusura:   { mascot:'finish',   title:'Ultimo step', desc:'' }
};

const step2 = [ /* 22 domande, ognuna con `chapter: <key>` sulla PRIMA
                   domanda del capitolo, `chapter: null` sulle successive
                   dello stesso capitolo — buildFlow() le raggruppa */ ];
```

**Tipi di domanda supportati** (campo `type`):
- `single` / `single-icon` — scelta singola (con o senza icona/desc per opzione)
- `multi` / `multi-icon` — scelta multipla con `max`, opzione `Altro` con
  campo di testo obbligatorio se selezionata (`hasInputOn` / `hasInput`)
- `likert5` — scala 1-5 con bottoni, `scaleLabels` opzionali per estremi
  personalizzati, flag `optional: true` per rendere la risposta non
  vincolante (usato per `open_listening`), campo `alert` per mostrare un box
  di avviso sopra la domanda (usato per "Rispondi solo se hai partecipato...")
- `nps` — griglia 0-10
- `slider` — usato solo per `termometro`, con `messages: {1: [emoji, testo], ...}`

**`buildFlow()`** costruisce l'array `flow` (la sequenza di schermate) a
partire da questi dati. I "kind" di step sono: `intro`, `q1intro`, `q1`,
`result`, `transition`, `chapter` (schermata di anticipazione capitolo),
`chapterSet` (schermata con tutte le domande del capitolo), `end`.
`idx` è l'indice corrente in `flow`; `render()` fa lo switch su `step.kind` e
chiama la funzione di render corrispondente.

Le risposte vengono salvate in `answers` (oggetto `{ id: valore }`, i multi
salvano array, i multi con "Altro" salvano anche `id+'_altro'`).

## 4. Mascotte animate (SVG generate via JS)

Non ci sono immagini esterne o GIF: **tutte le illustrazioni sono SVG
generati a runtime da funzioni JS**, con animazioni CSS (`@keyframes`).
Questo è un vincolo di design esplicito del cliente (niente asset esterni,
niente personaggi protetti da copyright tipo Simpson — richiesta esplicita
rifiutata in una sessione precedente).

Tre "famiglie" di generatori di mascotte:

1. **`mascotSVG(level)`** — la faccina-batteria del termometro (slider 1-10
   in My Energy Battery). 5 fasce di espressione (low/lowmid/mid/good/high),
   colore che va dal rosso al verde in base al livello, con "misuratore"
   interno che si riempie come una batteria vera. Riusata anche più grande
   nella result screen.
2. **`chapterMascotSVG(type)`** — le illustrazioni delle schermate di
   anticipazione dei 7 capitoli di Fattori Energy Battery. Tipi: `commute`,
   `talk`, `growth`, `tech`, `flow`, `timeline`, `finish`. Il tipo
   `timeline` (Prospettive) è più grande delle altre (classe CSS `.large`
   applicata condizionalmente) e ha l'animazione "occhi che guardano in
   direzioni diverse" (`chm-eyes-scan`) invece di un elemento che si muove
   sulla linea del tempo.
3. **`q1IntroMascotSVG(key)`** — le due mascotte per i popup di transizione
   dentro My Energy Battery (`team` = più batterie che parlano tra loro,
   `anno` = ciclo delle stagioni).

Ogni generatore usa CSS custom properties del design system (`--teal`,
`--amber`, `--coral`, `--magenta`, `--cyan`, `--ink`, ecc. — vedi `:root` in
cima al CSS) così le mascotte seguono automaticamente il tema caldo/freddo
della fase in cui compaiono.

**Se serve aggiungere una nuova mascotte**: seguire lo stesso pattern (SVG
inline con `viewBox`, uso delle CSS var per i colori, classe con
animation nel CSS) invece di introdurre immagini esterne — è una scelta di
design del cliente, non solo tecnica.

## 5. Design system rapido

- Palette: ambra/corallo/magenta per la fase "calda" (nominativa), teal/cyan
  per la fase "fredda" (anonima) — vedi `:root` e le regole
  `.device-frame.phase-cool ...` che sovrascrivono i colori quando si entra
  nella fase anonima (`setPhase(true)`).
- Font: "Fredoka" per titoli/numeri/badge, "Inter" per il testo (verificare
  se sono caricati da Google Fonts o incorporati — controllare `<head>`).
- Componenti riutilizzati: `.btn` / `.btn.ghost` / `.btn.cool`, `.opt-card`,
  `.likert` / `.likert-btn`, `.nps-grid` / `.nps-btn`, `.q-eyebrow-row` +
  `.q-eyebrow-badge` (badge "OGGI"/"ULTIMO ANNO"), `.modal-overlay` /
  `.modal-card` (per il pop-up nome/cognome), `.confetti-piece` (coriandoli
  riusati sia nella result screen sia nella end screen).

## 6. Cose importanti da NON rompere

- **Nessuna immagine/GIF esterna**: tutto SVG generato via JS. Richiesta
  esplicita del cliente, motivata anche da vincoli di copyright.
- **Single-file**: il prototipo deve restare un unico file HTML
  autosufficiente (nessuna richiesta di build step finora, va bene mantenerlo
  così finché non si passa allo sviluppo definitivo).
- **Le due mascotte HR nella end screen** (`end-figure-a` a sinistra bionda
  maglia corallo, `end-figure-b` a destra capelli castani maglia teal) sono
  state disegnate con la STESSA geometria/posa, solo colori diversi — se si
  modifica una bisogna specchiare le modifiche sull'altra per coerenza
  (richiesta esplicita del cliente in una revisione).
- **Bottone "Indietro"**: deve essere presente ovunque ci sia "Continua"
  (sia nelle domande singole `renderQ`, sia nelle schermate di anticipazione
  capitolo `renderChapter`, sia nelle schermate con le domande raggruppate
  `renderChapterSet`) — il cliente ha chiesto esplicitamente la
  navigazione bidirezionale ovunque.
- **Badge "OGGI" / "ULTIMO ANNO"**: logica in `renderQ`, si basa su
  `q.id === 'descrizione'` per decidere quale testo mostrare — se si
  aggiungono/rinominano domande in `step1`, aggiornare questa condizione.

## 7. Cose ancora aperte / da chiedere al cliente

- **GDPR/Privacy**: i dati di My Energy Battery sono nominativi + benessere
  → dati sensibili. Serve consultare il DPO prima del deploy reale. I
  manager non devono poter accedere ai dati individuali. Soglia minima di
  anonimato per gli aggregati: 5 risposte per segmento (già applicata nei
  mock della dashboard; da riportare nelle query SQL reali).
- **Skip logic reale** per la domanda `open_listening` ("Rispondi solo se hai
  partecipato alla sessione di Open Listening 2025") — al momento è solo
  "opzionale" (`optional: true`), non c'è una vera logica condizionale. Da
  implementare se serve per la versione reale.
- **BU/CDC e fasce di anzianità**: l'ultima revisione (commit `b107fcc`) ha
  aggiornato la domanda BU e rimosso "Consulenti esterni su One sys" dal
  filtro area (`95551ef`), ma le liste potrebbero non essere ancora definitive
  — da riconfirmare col cliente.
- **Integrazione Supabase reale**: la dashboard mostra dati mock; il prossimo
  passo tecnico è collegare survey e dashboard al database tramite API routes
  (vedi `web/README.md` sezione "Cosa manca ancora").
- **Provisioning utenti**: flusso di invito email per dipendenti e HR non
  ancora implementato (vedi `docs/architettura-proposta-pilota.md` §5).
- **Stack definitivo**: lo sviluppo è su Next.js + Supabase (vedi §1b e
  `docs/architettura-proposta-pilota.md`). Google AI Studio non è più
  l'ipotesi principale.

## 8. Come continuare a lavorarci

### Sul prototipo HTML (`Open_Listening_Active_Care_Prototype.html`)

- Diviso in sezioni via commenti `/* === NOME SEZIONE === */` nel JS —
  usarli per orientarsi (es. `RENDER`, `CHAPTER MASCOTS`, `Question rendering`).
- Per testare: è un file HTML statico, basta aprirlo in un browser (nessun
  build necessario).
- Prima di ogni modifica strutturale (es. aggiungere una domanda, un
  capitolo, un tipo di widget), verificare sempre `buildFlow()` e
  `updateHud()` insieme, perché entrambi devono conoscere ogni nuovo `kind`
  di step.

### Sull'app Next.js (`web/`)

- `npm run dev` da dentro `web/` per avviare il dev server.
- `npm run test` per i test unitari (Vitest).
- La dashboard (`/admin`) usa dati mock — cambiare qualcosa nel layout o
  nelle metriche non richiede un Supabase reale, basta `npm run dev`.
- Per modifiche al survey (`/survey`), verificare che il flow e le mascotte
  SVG si comportino come nel prototipo HTML di riferimento.
- Tono dei testi: colloquiale, poco "corporate", frasi brevi e dirette
  (preferenza esplicita del cliente, mostrata nelle riscritture ripetute
  della result screen).
