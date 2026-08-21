# Porting fase nominativa del survey ("My Energy Battery") — Design

> **Stato:** approvato dall'utente in chat, in scrittura del piano di implementazione.
> **Ambito:** porta la fase nominativa del prototipo (`Open_Listening_Active_Care_Prototype.html`)
> nell'app Next.js (`web/`), come componenti React idiomatici. La fase anonima
> (7 capitoli, 22 domande) resta fuori scope — piano separato successivo.

## 1. Obiettivo

Sostituire il placeholder di `web/src/app/survey/page.tsx` con l'esperienza reale
di "My Energy Battery": intro → 4 domande → result screen → transition screen,
fedele al prototipo per contenuti/testi/animazioni, ma:

- implementata come componenti React con stato React (non manipolazione diretta
  del DOM come nel prototipo), per integrarsi in futuro con il salvataggio dati
  su Supabase;
- **senza** il modal "Prima di iniziare" (Nome/Cognome) — l'identità del
  dipendente arriva già dal login Supabase (`requireRole`), il modal è
  ridondante;
- **senza** la cornice finta "telefono"/toggle desktop-mobile del prototipo —
  era un accorgimento solo per presentare il mockup, l'app reale usa un layout
  responsive nativo.

## 2. Fuori scope (rimandato)

- I 7 capitoli/22 domande della fase anonima ("Fattori Energy Battery") e la
  end screen.
- Salvataggio reale delle risposte su Supabase (schema/migrazioni non ancora
  progettati) — le risposte restano in stato React in memoria per questo giro.
- Qualunque logica di skip condizionale (es. `open_listening`) — non riguarda
  la fase nominativa.

## 3. Flusso (porting di `buildFlow()` per la sola fase 1)

Sequenza esatta, dal prototipo (`Open_Listening_Active_Care_Prototype.html:455-481`):

1. `intro` — schermata di apertura, bottone "Iniziamo"
2. `q1intro` (`key: 'team'`) — popup "concentrati sul clima del team"
3. `q1` → domanda `clima` (single-icon, 4 opzioni con emoji)
4. `q1` → domanda `termometro` (slider 1-10 con mascotte animata)
5. `q1` → domanda `causa` (multi-icon, max 2, opzione "Altro" con testo libero)
6. `q1intro` (`key: 'anno'`) — popup "concentrati sull'ultimo anno"
7. `q1` → domanda `descrizione` (single-icon, 4 opzioni)
8. `result` — sintesi testuale generata dalle 4 risposte, mascotte grande,
   coriandoli se energia alta, alone calmo se energia bassa
9. `transition` — "da qui in poi, in totale anonimato" (bottone che in futuro
   attiverà la fase 2 — per questo piano, è l'ultimo step: bottone presente ma
   senza step successivo reale, si ferma qui)

Il badge eyebrow "OGGI"/"ULTIMO ANNO" (dal prototipo, basato su
`q.id==='descrizione'`) va portato identico.

## 4. Dati (porting letterale di `step1`, righe 348-393)

Le 4 domande (`clima`, `termometro`, `causa`, `descrizione`) con tutti i testi,
emoji, e messaggi del termometro (1-10) vanno copiati **verbatim** dal
prototipo in `web/src/features/survey/data.ts`, tipizzati (vedi sezione 6).
Nessuna riformulazione dei testi — sono già stati validati con il cliente.

## 5. Componenti

```
web/src/features/survey/
  types.ts                    — tipi Question (per fase 1) e FlowStep
  data.ts                     — step1 (le 4 domande)
  flow.ts                     — buildPhase1Flow(): FlowStep[]
  mascots.tsx                 — EnergyMascot({level}), Q1IntroMascot({variant})
  SurveyApp.tsx                — client component, stato (idx, answers), switch su step.kind
  survey.css                   — stili portati dal prototipo (vedi sezione 7)
  screens/
    IntroScreen.tsx
    Q1IntroScreen.tsx
    QuestionScreen.tsx          — dispatch per q.type
    QuestionSingleIcon.tsx
    QuestionMultiIcon.tsx
    QuestionSlider.tsx
    ResultScreen.tsx
    TransitionScreen.tsx
```

`web/src/app/survey/page.tsx` (Server Component, già esistente da PR #3) resta
com'è per l'auth gate (`requireRole`), ma il suo contenuto placeholder viene
sostituito da `<SurveyApp userEmail={user.email} />`.

**`SurveyApp.tsx`** possiede lo stato:
```ts
const [idx, setIdx] = useState(0)
const [answers, setAnswers] = useState<Record<string, unknown>>({})
```
e fa `flow[idx]` → switch su `step.kind` per scegliere quale screen renderizzare,
passando `answers`/`setAnswers`/`goNext`/`goBack` come props. Stessa forma
concettuale di `idx`/`render()` nel prototipo, ma via stato React invece di
mutazione diretta di variabili globali + DOM.

**Mascotte** (`mascots.tsx`): `EnergyMascot({level})` è il porting di
`mascotSVG(level)` (prototipo, righe 559-608) — funzione pura, stesso
`level` → stesso SVG, quindi facilmente testabile. `Q1IntroMascot({variant})`
è il porting di `q1IntroMascotSVG(key)` (righe 657-696).

## 6. Tipi (TypeScript)

```ts
export type SingleIconOption = { icon: string; label: string; desc?: string }
export type MultiIconOption = { icon: string; label: string; hasInput?: boolean }

export type SingleIconQuestion = {
  id: string
  type: 'single-icon'
  title: string
  sub?: string
  options: SingleIconOption[]
}

export type MultiIconQuestion = {
  id: string
  type: 'multi-icon'
  max: number
  title: string
  sub?: string
  options: MultiIconOption[]
}

export type SliderQuestion = {
  id: string
  type: 'slider'
  title: string
  sub?: string
  messages: Record<number, [emoji: string, text: string]>
}

export type Phase1Question = SingleIconQuestion | MultiIconQuestion | SliderQuestion

export type FlowStep =
  | { kind: 'intro' }
  | { kind: 'q1intro'; key: 'team' | 'anno' }
  | { kind: 'q1'; question: Phase1Question }
  | { kind: 'result' }
  | { kind: 'transition' }
```

## 7. CSS

Un unico `web/src/features/survey/survey.css`, importato da `SurveyApp.tsx`,
contenente le regole del prototipo per: variabili di design system rilevanti
alla fase caldo/ambra (`--amber`, `--coral`, `--magenta`, font Fredoka/Inter),
`.intro-*`, `.q1intro-*`, `.q-eyebrow*`, `.opt-card`, `.slider-*`,
`.scale-labels`, `.footer-nav`, `.btn`/`.btn.ghost`, `.result-*`,
`.confetti-piece`, `.transition`/`.lock-wrap`/`.network-svg`/`.microcopy`,
le `@keyframes` delle mascotte (`mascot-tired`, `mascot-idle`, `mascot-good`,
`mascot-hyper`, `mascot-spark`, `chm-walk-*`, `chm-bubble`, `q1i-rotate`).
Copiate verbatim dal `<style>` del prototipo — **non** le regole
`.device-frame`/`.phase-cool`/toggle mobile-desktop (droppate, sezione 1).

Layout responsive: il contenuto occupa la larghezza della pagina reale, con
un `max-width` centrato su desktop (valore ragionevole, es. 480px, coerente
con l'ingombro visivo attuale delle card) invece della cornice-telefono fissa.

## 8. Testing

- **Unit test (Vitest), comportamento reale non mock:**
  - `buildPhase1Flow()` — la sequenza esatta di 9 step nell'ordine della
    sezione 3, con i `key`/`question.id` giusti.
  - `EnergyMascot`/mascotte: dato un `level`, verificare che la fascia
    (`low`/`lowmid`/`mid`/`good`/`high`) corrisponda ai confini del
    prototipo (`<=2`, `<=4`, `<=6`, `<=8`, altrimenti) — porting di
    `mascotBucket()` come funzione esportata e testata separatamente
    dal solo rendering SVG.
- **Verifica manuale in browser** (non automatizzabile senza un vero
  provisioning utente, stesso vincolo delle fasi precedenti): l'intero
  percorso intro → 4 domande → result → transition, controllando che i
  bottoni "Continua" si abilitino solo a risposta data, che "Indietro"
  funzioni su ogni step, e che il risultato cambi in modo sensato al variare
  delle risposte.

## 9. Rischi/punti aperti

- Questo lavoro dipende da `web/` (PR #3, `feature/nextjs-scaffold`), non
  ancora mergiata in `main` — il branch di questo piano parte da
  `feature/nextjs-scaffold`, quindi la sua PR sarà "stacked" finché la #3
  non viene mergiata.
- Il bottone "Continua in anonimato →" della transition screen, per ora, non
  ha un vero step successivo da raggiungere (i capitoli anonimi sono fuori
  scope) — verrà lasciato come bottone visibile ma senza navigazione reale
  oltre lo step `transition` stesso (comportamento da definire nel prossimo
  piano, quando i capitoli saranno portati).
