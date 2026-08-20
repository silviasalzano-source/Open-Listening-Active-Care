# CLAUDE.md — Open Listening · Active Care (OT Consulting)

Questo file serve come hand-off per continuare lo sviluppo con Claude Code.
Contiene il contesto del progetto, lo stato attuale, le decisioni prese e i
prossimi passi, così da non dover ripartire da zero.

## 1. Cos'è questo progetto

Prototipo interattivo HTML/CSS/JS (single-file, self-contained, no build step)
di un'app di survey aziendale per **OT Consulting**, chiamata
**"Open Listening · Active Care"**.

Il progetto nasce da una consulenza di psicologia HR (item bank su Excel) ed è
diventato un prototipo cliccabile in HTML per validare UX/UI prima dello
sviluppo definitivo (probabilmente su Google AI Studio o altro stack, non
ancora deciso).

**File principale:** `Open_Listening_Active_Care_Prototype.html`
(circa 1300 righe: CSS in `<style>`, markup in `<body>`, logica in un unico
`<script>` a fondo pagina, vanilla JS, nessuna dipendenza esterna).

Esiste anche un item bank Excel collegato (`Survey_Battery_Item_Bank_v19.xlsx`)
con le domande "ufficiali" del progetto, usato come fonte per i testi delle
domande del prototipo — utile come riferimento se serve verificare/allineare
la formulazione esatta delle domande.

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
  anonimato per gli aggregati: 5 risposte per segmento.
- **Skip logic reale** per la domanda `open_listening` ("Rispondi solo se hai
  partecipato alla sessione di Open Listening 2025") — al momento è solo
  "opzionale" (`optional: true`, non blocca l'avanzamento), ma non c'è una
  vera logica condizionale che la nasconde a chi non ha partecipato. Da
  implementare se serve per la versione reale.
- **BU/CDC e fasce di anzianità**: il cliente deve far rivedere/aggiornare
  queste liste dal responsabile competente (opzioni della domanda `bu` e
  `anzianita` in `step2`) — potrebbero non essere definitive.
- **Sviluppo definitivo**: il prototipo HTML è solo per validare UX/UI. Lo
  sviluppo vero probabilmente andrà su un altro stack (Google AI Studio è
  stato menzionato in una fase iniziale del progetto, ma non è stata presa
  una decisione definitiva) con backend reale e separazione tecnica tra dati
  nominativi e anonimi.
- **Dashboard analytics HR**: non ancora specificata nel dettaglio (medie,
  percentuali, conteggi per area) — solo menzionata come next step.
- **Nome del capitolo "Area e ruolo"**: era originariamente "Anagrafica", il
  cliente ha chiesto di cambiarlo ma senza indicare il nome definitivo nella
  stessa richiesta; è stato scelto "Area e ruolo" come default ragionevole
  ma non è stato confermato esplicitamente dal cliente.

## 8. Come continuare a lavorarci

- Il file è abbastanza grande (>1300 righe) ma diviso in sezioni chiare via
  commenti `/* ======================= NOME SEZIONE ======================= */`
  nel JS — usarli per orientarsi rapidamente (es. `RENDER`, `CHAPTER
  MASCOTS`, `Question rendering`).
- Per testare rapidamente le modifiche: è un file HTML statico, basta aprirlo
  in un browser (nessun server/build necessario).
- Prima di ogni modifica strutturale (es. aggiungere una domanda, un
  capitolo, un tipo di widget), verificare sempre `buildFlow()` e
  `updateHud()` insieme, perché entrambi devono conoscere ogni nuovo `kind`
  di step per calcolare correttamente la percentuale di avanzamento e la
  fase caldo/freddo.
- Quando si aggiunge testo, il cliente ha mostrato più volte preferenza per
  un tono colloquiale, poco "corporate", con frasi brevi e dirette (vedi le
  riscritture ripetute del testo della result screen come esempio di tono
  target).
