# Persistenza Fase Nominativa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collegare `SurveyApp` (fase 1, "My Energy Battery") allo schema
database Supabase già applicato: creare/riprendere una `submission`,
salvare le risposte in modo incrementale, far scattare automaticamente
`status = 'submitted'` a compilazione completa.

**Architecture:** `web/src/app/survey/page.tsx` (Server Component) orchestra
i passaggi server-side (campagna attiva → get-or-create submission →
risposte già salvate → indice di ripresa) e passa i risultati come props
iniziali a `SurveyApp` (client component). Il salvataggio passa da un unico
endpoint API (`POST /api/survey/nominative-answer`) che usa il client
Supabase server-side (sessione utente via cookie, quindi le RLS si
applicano con l'identità reale).

**Tech Stack:** Next.js App Router (Server Components + Route Handlers),
`@supabase/ssr` (client server-side già esistente), TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-21-nominative-persistence-design.md`
(vedi in particolare la sezione 9, aggiunta dopo l'approvazione iniziale,
sulla persistenza di `nome`/`cognome`).

## Global Constraints

- Le 4 domande obbligatorie della fase 1 sono `clima`, `termometro`,
  `causa`, `descrizione` (in quest'ordine, da `web/src/features/survey/data.ts`,
  `step1`). Il `NameModal` raccoglie anche `nome`/`cognome`, obbligatori
  anch'essi — l'insieme completo che fa scattare `status = 'submitted'` è
  **6 campi**: `nome`, `cognome`, `clima`, `termometro`, `causa`, `descrizione`
  (spec, sezione 9).
- `causa_altro` (testo libero della domanda "Altro") va salvato come riga
  separata con `question_id = 'causa_altro'` **solo se non vuoto**, e non fa
  parte dell'insieme obbligatorio.
- Adattamento al ciclo di test: nessun progetto Supabase reale è
  raggiungibile da questo ambiente di sviluppo (nessuna credenziale in
  `web/.env.local`, che è gitignored e non presente in questo worktree). I
  task che toccano Supabase (get/create campagna, get/create submission,
  l'endpoint API, il wiring di `SurveyApp`/`page.tsx`) vanno verificati
  manualmente da chi esegue il piano, con `npm run dev` contro il progetto
  Supabase reale già configurato dall'utente — stesso vincolo già affrontato
  nel piano dello schema database. L'unico task con TDD automatizzato è il
  Task 1 (`resume.ts`), funzione pura senza dipendenze da Supabase.
- Path alias del progetto: `@/*` → `web/src/*` (`tsconfig.json`).
- Ruoli letti da `auth.jwt() -> 'app_metadata' ->> 'role'` lato DB / da
  `user.app_metadata.role` lato `requireRole` — nessuna modifica a questo
  meccanismo in questo piano.
- Fuori scope (spec, sezione 10): persistenza fase anonima, modifica di una
  submission già `submitted` (finestra `edit_window`), UI dashboard HR.

---

## File Structure

```
web/src/lib/survey/
  activeCampaign.ts     — Campaign type, getActiveCampaign(supabase)
  submission.ts         — Submission type, getOrCreateSubmission(supabase, userId, campaignId)
  resume.ts             — computeResumeIndex(flow, answers, status) — pura

web/src/app/api/survey/nominative-answer/route.ts   — POST, upsert + eventuale flip a 'submitted'

web/src/features/survey/screens/NoActiveCampaignScreen.tsx   — nuovo screen

web/src/app/survey/page.tsx                          — MODIFICA: orchestrazione
web/src/features/survey/SurveyApp.tsx                — MODIFICA: props iniziali, salvataggio, stato saving/errore
web/src/features/survey/screens/NameModal.tsx        — MODIFICA: props saving/error
web/src/features/survey/survey.css                   — MODIFICA: stili per stato di salvataggio/errore
```

---

### Task 1: `computeResumeIndex` (funzione pura, TDD)

**Files:**
- Create: `web/src/lib/survey/resume.ts`
- Test: `web/tests/lib/survey-resume.test.ts`

**Interfaces:**
- Consumes: `FlowStep`, `Phase1Answers` da `web/src/features/survey/types.ts` (esistenti); `buildPhase1Flow` da `web/src/features/survey/flow.ts` (esistente, solo nei test).
- Produces: `computeResumeIndex(flow: FlowStep[], answers: Phase1Answers, status: 'in_progress' | 'submitted'): number` — usata dal Task 6.

- [ ] **Step 1: Scrivi i test (falliranno perché il modulo non esiste)**

```typescript
// web/tests/lib/survey-resume.test.ts
import { describe, expect, it } from 'vitest'
import { computeResumeIndex } from '../../src/lib/survey/resume'
import { buildPhase1Flow } from '../../src/features/survey/flow'
import type { Phase1Answers } from '../../src/features/survey/types'

describe('computeResumeIndex', () => {
  it('returns the intro index (0) when there are no answers at all', () => {
    const flow = buildPhase1Flow()
    expect(computeResumeIndex(flow, {}, 'in_progress')).toBe(0)
  })

  it('returns the intro index (0) when identity (nome/cognome) is missing, even if some q1 answers exist', () => {
    const flow = buildPhase1Flow()
    const answers: Phase1Answers = { clima: 'Soleggiato' }
    expect(computeResumeIndex(flow, answers, 'in_progress')).toBe(0)
  })

  it('resumes at the first unanswered question, skipping the intervening q1intro popup', () => {
    const flow = buildPhase1Flow()
    const answers: Phase1Answers = {
      nome: 'Mario',
      cognome: 'Rossi',
      clima: 'Soleggiato',
      termometro: 7,
      causa: ['Carico di lavoro'],
    }
    const idx = computeResumeIndex(flow, answers, 'in_progress')
    const step = flow[idx]
    if (step.kind !== 'q1') throw new Error('expected a q1 step')
    expect(step.question.id).toBe('descrizione')
  })

  it('resumes at the first q1 step when identity is present but no question is answered yet', () => {
    const flow = buildPhase1Flow()
    const answers: Phase1Answers = { nome: 'Mario', cognome: 'Rossi' }
    const idx = computeResumeIndex(flow, answers, 'in_progress')
    const step = flow[idx]
    if (step.kind !== 'q1') throw new Error('expected a q1 step')
    expect(step.question.id).toBe('clima')
  })

  it('returns the result step index when status is submitted, regardless of answers', () => {
    const flow = buildPhase1Flow()
    const answers: Phase1Answers = {
      nome: 'Mario',
      cognome: 'Rossi',
      clima: 'Soleggiato',
      termometro: 7,
      causa: ['Carico di lavoro'],
      descrizione: 'Energia in Crescita',
    }
    const idx = computeResumeIndex(flow, answers, 'submitted')
    expect(flow[idx].kind).toBe('result')
  })
})
```

- [ ] **Step 2: Esegui i test e verifica che falliscano**

Run: `cd web && npm run test -- survey-resume`
Expected: FAIL con errore di risoluzione modulo (`Cannot find module '../../src/lib/survey/resume'`)

- [ ] **Step 3: Implementa il modulo**

```typescript
// web/src/lib/survey/resume.ts
import type { FlowStep, Phase1Answers } from '@/features/survey/types'

export function computeResumeIndex(
  flow: FlowStep[],
  answers: Phase1Answers,
  status: 'in_progress' | 'submitted'
): number {
  if (status === 'submitted') {
    const resultIdx = flow.findIndex((step) => step.kind === 'result')
    return resultIdx === -1 ? 0 : resultIdx
  }

  const hasIdentity = answers.nome !== undefined && answers.cognome !== undefined
  if (!hasIdentity) {
    return 0
  }

  const firstUnanswered = flow.findIndex(
    (step) => step.kind === 'q1' && answers[step.question.id as keyof Phase1Answers] === undefined
  )

  return firstUnanswered === -1 ? 0 : firstUnanswered
}
```

- [ ] **Step 4: Esegui i test e verifica che passino**

Run: `cd web && npm run test -- survey-resume`
Expected: PASS, 5 test superati

- [ ] **Step 5: Esegui l'intera suite per verificare che non ci siano regressioni**

Run: `cd web && npm run test`
Expected: PASS, tutti i test esistenti + i 5 nuovi

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/survey/resume.ts web/tests/lib/survey-resume.test.ts
git commit -m "feat(survey): add computeResumeIndex for resuming an in-progress submission"
```

---

### Task 2: `getActiveCampaign`

**Files:**
- Create: `web/src/lib/survey/activeCampaign.ts`

**Interfaces:**
- Consumes: `SurveyCampaignWindow` da `web/src/lib/campaigns/windows.ts` (esistente); `SupabaseClient` da `@supabase/supabase-js`.
- Produces: `type Campaign = SurveyCampaignWindow & { id: string; name: string }`; `getActiveCampaign(supabase: SupabaseClient): Promise<Campaign | null>` — usata dal Task 6.

- [ ] **Step 1: Implementa il modulo**

```typescript
// web/src/lib/survey/activeCampaign.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { SurveyCampaignWindow } from '@/lib/campaigns/windows'

export type Campaign = SurveyCampaignWindow & {
  id: string
  name: string
}

export async function getActiveCampaign(supabase: SupabaseClient): Promise<Campaign | null> {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('survey_campaigns')
    .select(
      'id, name, compilation_window_start, compilation_window_end, edit_window_start, edit_window_end'
    )
    .lte('compilation_window_start', now)
    .gte('compilation_window_end', now)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch active campaign: ${error.message}`)
  }

  return data
}
```

- [ ] **Step 2: Verifica il tipo con la build TypeScript**

Run: `cd web && npx tsc --noEmit`
Expected: nessun errore relativo a questo file (l'assenza di credenziali Supabase non impedisce il type-check, che non esegue codice)

- [ ] **Step 3: Verifica manuale (richiede il progetto Supabase reale già configurato dall'utente)**

Non eseguibile in questo ambiente di sviluppo. Chi esegue il piano dovrebbe,
dopo aver completato anche il Task 6 (che usa questa funzione), verificare
manualmente con `npm run dev`:
- con una campagna la cui `compilation_window` include `now()`: la funzione
  ritorna quella campagna.
- senza nessuna campagna con finestra aperta: la funzione ritorna `null`.

- [ ] **Step 4: Commit**

```bash
git add web/src/lib/survey/activeCampaign.ts
git commit -m "feat(survey): add getActiveCampaign"
```

---

### Task 3: `getOrCreateSubmission`

**Files:**
- Create: `web/src/lib/survey/submission.ts`

**Interfaces:**
- Consumes: `SupabaseClient` da `@supabase/supabase-js`.
- Produces: `type SubmissionStatus = 'in_progress' | 'submitted'`; `type Submission = { id: string; campaign_id: string; user_id: string; status: SubmissionStatus; submitted_at: string | null; last_edited_at: string | null; created_at: string }`; `getOrCreateSubmission(supabase: SupabaseClient, userId: string, campaignId: string): Promise<Submission>` — usata dal Task 6.

- [ ] **Step 1: Implementa il modulo**

```typescript
// web/src/lib/survey/submission.ts
import type { SupabaseClient } from '@supabase/supabase-js'

export type SubmissionStatus = 'in_progress' | 'submitted'

export type Submission = {
  id: string
  campaign_id: string
  user_id: string
  status: SubmissionStatus
  submitted_at: string | null
  last_edited_at: string | null
  created_at: string
}

export async function getOrCreateSubmission(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string
): Promise<Submission> {
  const { data: existing, error: selectError } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .eq('campaign_id', campaignId)
    .maybeSingle()

  if (selectError) {
    throw new Error(`Failed to fetch submission: ${selectError.message}`)
  }

  if (existing) {
    return existing
  }

  const { data: created, error: insertError } = await supabase
    .from('submissions')
    .insert({ user_id: userId, campaign_id: campaignId })
    .select('*')
    .single()

  if (insertError) {
    // 23505 = unique_violation: una richiesta concorrente (es. due tab
    // aperte) ha già creato la riga tra la select e la insert — rileggila.
    if (insertError.code === '23505') {
      const { data: retried, error: retryError } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .eq('campaign_id', campaignId)
        .single()

      if (retryError) {
        throw new Error(`Failed to fetch submission after conflict: ${retryError.message}`)
      }

      return retried
    }

    throw new Error(`Failed to create submission: ${insertError.message}`)
  }

  return created
}
```

- [ ] **Step 2: Verifica il tipo con la build TypeScript**

Run: `cd web && npx tsc --noEmit`
Expected: nessun errore relativo a questo file

- [ ] **Step 3: Verifica manuale (richiede il progetto Supabase reale, dopo il Task 6)**

- primo accesso di un utente a una campagna: viene creata una riga
  `submissions` con `status = 'in_progress'`.
- accesso successivo dello stesso utente alla stessa campagna: viene
  restituita la riga esistente, nessuna riga duplicata (verificabile anche
  da SQL Editor: `select count(*) from submissions where user_id = '<id>' and campaign_id = '<id>';`
  deve restituire sempre 1).

- [ ] **Step 4: Commit**

```bash
git add web/src/lib/survey/submission.ts
git commit -m "feat(survey): add getOrCreateSubmission"
```

---

### Task 4: Endpoint `POST /api/survey/nominative-answer`

**Files:**
- Create: `web/src/app/api/survey/nominative-answer/route.ts`

**Interfaces:**
- Consumes: `createClient` da `@/lib/supabase/server` (esistente).
- Produces: endpoint `POST /api/survey/nominative-answer`, body `{ submissionId: string, questionId: string, answer: unknown }`, risposta `{ ok: true }` (200) o `{ error: string, message?: string }` (401/400/403/500) — usato dal Task 7.

- [ ] **Step 1: Implementa la route**

```typescript
// web/src/app/api/survey/nominative-answer/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MANDATORY_QUESTION_IDS = ['nome', 'cognome', 'clima', 'termometro', 'causa', 'descrizione']

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: { submissionId?: string; questionId?: string; answer?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Corpo della richiesta non valido.' },
      { status: 400 }
    )
  }

  const { submissionId, questionId, answer } = body

  if (!submissionId || !questionId || answer === undefined) {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Campi mancanti.' },
      { status: 400 }
    )
  }

  const { error: upsertError } = await supabase
    .from('nominative_responses')
    .upsert(
      { submission_id: submissionId, question_id: questionId, answer },
      { onConflict: 'submission_id,question_id' }
    )

  if (upsertError) {
    // 42501 = insufficient_privilege: la RLS ha rifiutato la scrittura
    // (es. la finestra di compilazione/modifica non è più aperta).
    if (upsertError.code === '42501') {
      return NextResponse.json(
        {
          error: 'window_closed',
          message: 'La finestra di compilazione o modifica non è più aperta.',
        },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'save_failed', message: upsertError.message },
      { status: 500 }
    )
  }

  const { data: savedResponses, error: countError } = await supabase
    .from('nominative_responses')
    .select('question_id')
    .eq('submission_id', submissionId)
    .in('question_id', MANDATORY_QUESTION_IDS)

  if (countError) {
    return NextResponse.json(
      { error: 'save_failed', message: countError.message },
      { status: 500 }
    )
  }

  const allMandatoryAnswered = MANDATORY_QUESTION_IDS.every((id) =>
    savedResponses?.some((row) => row.question_id === id)
  )

  if (allMandatoryAnswered) {
    const { error: submitError } = await supabase
      .from('submissions')
      .update({ status: 'submitted', submitted_at: new Date().toISOString() })
      .eq('id', submissionId)
      .eq('status', 'in_progress')

    if (submitError) {
      return NextResponse.json(
        { error: 'submit_failed', message: submitError.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Verifica il tipo con la build TypeScript**

Run: `cd web && npx tsc --noEmit`
Expected: nessun errore relativo a questo file

- [ ] **Step 3: Verifica manuale (richiede il progetto Supabase reale e un utente autenticato)**

Con `npm run dev` attivo e loggati come `employee` (cookie di sessione nel
browser), da un altro terminale, sostituendo `<submissionId>` con una
submission reale dell'utente loggato:

```bash
curl -X POST http://localhost:3000/api/survey/nominative-answer \
  -H "Content-Type: application/json" \
  -H "Cookie: <incolla qui i cookie di sessione dal browser>" \
  -d '{"submissionId": "<submissionId>", "questionId": "clima", "answer": "Soleggiato"}'
```

Verifiche:
- risposta `{"ok":true}`, e in Supabase `select * from nominative_responses where submission_id = '<submissionId>';` mostra la riga.
- ripetendo la stessa chiamata due volte: nessun errore, la riga viene
  aggiornata (upsert), non duplicata.
- senza cookie di sessione (richiesta senza `Cookie:`): risposta 401.
- dopo aver salvato tutte e 6 le risposte obbligatorie per una submission:
  `select status, submitted_at from submissions where id = '<submissionId>';`
  mostra `status = 'submitted'` e `submitted_at` popolato.

- [ ] **Step 4: Commit**

```bash
git add web/src/app/api/survey/nominative-answer/route.ts
git commit -m "feat(survey): add POST /api/survey/nominative-answer endpoint"
```

---

### Task 5: `NoActiveCampaignScreen`

**Files:**
- Create: `web/src/features/survey/screens/NoActiveCampaignScreen.tsx`

**Interfaces:**
- Consumes: nessuna dipendenza esterna.
- Produces: `NoActiveCampaignScreen()` — componente React senza props, usato dal Task 6.

- [ ] **Step 1: Implementa il componente**

```tsx
// web/src/features/survey/screens/NoActiveCampaignScreen.tsx
export function NoActiveCampaignScreen() {
  return (
    <div className="survey-screen">
      <h2 className="q-title">Nessun survey attivo al momento</h2>
      <p className="q-sub">
        Non c&apos;è nessuna compilazione aperta in questo momento. Controlla più
        tardi, o contatta HR se pensi sia un errore.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verifica il tipo con la build TypeScript**

Run: `cd web && npx tsc --noEmit`
Expected: nessun errore relativo a questo file

- [ ] **Step 3: Commit**

```bash
git add web/src/features/survey/screens/NoActiveCampaignScreen.tsx
git commit -m "feat(survey): add NoActiveCampaignScreen"
```

---

### Task 6: Orchestrazione in `page.tsx`

**Files:**
- Modify: `web/src/app/survey/page.tsx`

**Interfaces:**
- Consumes: `requireRole` (esistente); `createClient` da `@/lib/supabase/server` (esistente); `getActiveCampaign` (Task 2); `getOrCreateSubmission` (Task 3); `computeResumeIndex` (Task 1); `buildFullFlow` da `@/features/survey/flow` (esistente); `NoActiveCampaignScreen` (Task 5); `Phase1Answers` da `@/features/survey/types` (esistente).
- Produces: `SurveyPage` renderizza `<SurveyApp submissionId initialPhase1Answers initialIdx />` — le props che il Task 7 deve accettare, esattamente con questi nomi e tipi (`submissionId: string`, `initialPhase1Answers: Phase1Answers`, `initialIdx: number`).

- [ ] **Step 1: Sostituisci il contenuto del file**

```tsx
// web/src/app/survey/page.tsx
import { requireRole } from '@/lib/auth/requireRole'
import { createClient } from '@/lib/supabase/server'
import { getActiveCampaign } from '@/lib/survey/activeCampaign'
import { getOrCreateSubmission } from '@/lib/survey/submission'
import { computeResumeIndex } from '@/lib/survey/resume'
import { buildFullFlow } from '@/features/survey/flow'
import { SurveyApp } from '@/features/survey/SurveyApp'
import { NoActiveCampaignScreen } from '@/features/survey/screens/NoActiveCampaignScreen'
import type { Phase1Answers } from '@/features/survey/types'

export default async function SurveyPage() {
  const { user } = await requireRole(['employee', 'hr_admin'])
  const supabase = await createClient()

  const campaign = await getActiveCampaign(supabase)
  if (!campaign) {
    return <NoActiveCampaignScreen />
  }

  const submission = await getOrCreateSubmission(supabase, user.id, campaign.id)

  const { data: responses, error } = await supabase
    .from('nominative_responses')
    .select('question_id, answer')
    .eq('submission_id', submission.id)

  if (error) {
    throw new Error(`Failed to fetch nominative responses: ${error.message}`)
  }

  const initialPhase1Answers = (responses ?? []).reduce<Phase1Answers>((acc, row) => {
    return { ...acc, [row.question_id]: row.answer }
  }, {})

  const flow = buildFullFlow()
  const initialIdx = computeResumeIndex(flow, initialPhase1Answers, submission.status)

  return (
    <SurveyApp
      submissionId={submission.id}
      initialPhase1Answers={initialPhase1Answers}
      initialIdx={initialIdx}
    />
  )
}
```

- [ ] **Step 2: Verifica il tipo con la build TypeScript**

Run: `cd web && npx tsc --noEmit`
Expected: errori attesi SOLO relativi a `SurveyApp` che non accetta ancora
queste props (verrà corretto dal Task 7) — nessun altro errore in questo
file.

- [ ] **Step 3: Commit**

```bash
git add web/src/app/survey/page.tsx
git commit -m "feat(survey): orchestrate active campaign, submission and resume in survey page"
```

---

### Task 7: Salvataggio incrementale in `SurveyApp` + `NameModal`

**Files:**
- Modify: `web/src/features/survey/SurveyApp.tsx`
- Modify: `web/src/features/survey/screens/NameModal.tsx`
- Modify: `web/src/features/survey/survey.css`

**Interfaces:**
- Consumes: props `submissionId: string`, `initialPhase1Answers: Phase1Answers`, `initialIdx: number` (dal Task 6); endpoint `POST /api/survey/nominative-answer` (Task 4).
- Produces: `SurveyApp({ submissionId, initialPhase1Answers, initialIdx })` — nessun altro modulo dipende da questo task.

- [ ] **Step 1: Sostituisci il contenuto di `SurveyApp.tsx`**

```tsx
// web/src/features/survey/SurveyApp.tsx
'use client'

import { useState } from 'react'
import { step1 } from './data'
import { buildFullFlow } from './flow'
import { Hud } from './screens/Hud'
import { IntroScreen } from './screens/IntroScreen'
import { NameModal } from './screens/NameModal'
import { Q1IntroScreen } from './screens/Q1IntroScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { ResultScreen } from './screens/ResultScreen'
import { TransitionScreen } from './screens/TransitionScreen'
import { FocusScreen } from './screens/FocusScreen'
import { ChapterScreen } from './screens/ChapterScreen'
import { ChapterSetScreen } from './screens/ChapterSetScreen'
import { EndScreen } from './screens/EndScreen'
import type { Phase1Answers, Phase1Question, SurveyAnswers } from './types'
import './survey.css'

const flow = buildFullFlow()
const totalPhase1Questions = step1.length

type SaveResult = { ok: true } | { ok: false; message: string }

async function saveNominativeAnswer(
  submissionId: string,
  questionId: string,
  answer: unknown
): Promise<SaveResult> {
  try {
    const res = await fetch('/api/survey/nominative-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, questionId, answer }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { ok: false, message: body.message ?? 'Salvataggio non riuscito. Riprova.' }
    }

    return { ok: true }
  } catch {
    return { ok: false, message: 'Errore di rete. Riprova.' }
  }
}

export function SurveyApp({
  submissionId,
  initialPhase1Answers,
  initialIdx,
}: {
  submissionId: string
  initialPhase1Answers: Phase1Answers
  initialIdx: number
}) {
  const [idx, setIdx] = useState(initialIdx)
  const [showNameModal, setShowNameModal] = useState(false)
  const [phase1Answers, setPhase1Answers] = useState<Phase1Answers>(initialPhase1Answers)
  const [phase2Answers, setPhase2Answers] = useState<SurveyAnswers>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  function goNext() {
    setIdx((i) => Math.min(i + 1, flow.length - 1))
  }
  function goBack() {
    setIdx((i) => Math.max(i - 1, 0))
  }

  function setPhase1Answer(id: string, value: unknown) {
    setPhase1Answers((prev) => ({ ...prev, [id]: value }) as Phase1Answers)
  }

  function setPhase2Answer(id: string, value: string | string[] | number | undefined) {
    setPhase2Answers((prev) => ({ ...prev, [id]: value }))
  }

  async function handleNameConfirm(nome: string, cognome: string) {
    setPhase1Answer('nome', nome)
    setPhase1Answer('cognome', cognome)
    setSaving(true)
    setSaveError(null)

    const nomeResult = await saveNominativeAnswer(submissionId, 'nome', nome)
    if (!nomeResult.ok) {
      setSaving(false)
      setSaveError(nomeResult.message)
      return
    }

    const cognomeResult = await saveNominativeAnswer(submissionId, 'cognome', cognome)
    setSaving(false)
    if (!cognomeResult.ok) {
      setSaveError(cognomeResult.message)
      return
    }

    setShowNameModal(false)
    goNext()
  }

  async function handleQ1Next(question: Phase1Question) {
    const value = phase1Answers[question.id as keyof Phase1Answers]
    setSaving(true)
    setSaveError(null)

    const result = await saveNominativeAnswer(submissionId, question.id, value)
    if (!result.ok) {
      setSaving(false)
      setSaveError(result.message)
      return
    }

    if (question.id === 'causa') {
      const altro = phase1Answers.causa_altro
      if (altro && altro.trim().length > 0) {
        const altroResult = await saveNominativeAnswer(submissionId, 'causa_altro', altro)
        setSaving(false)
        if (!altroResult.ok) {
          setSaveError(altroResult.message)
          return
        }
        goNext()
        return
      }
    }

    setSaving(false)
    goNext()
  }

  const step = flow[idx]
  const isCoolPhase = step.kind === 'chapter' || step.kind === 'chapterSet' || step.kind === 'end'

  const progress = Math.round((idx / (flow.length - 1)) * 100)

  return (
    <>
      {showNameModal && (
        <NameModal onConfirm={handleNameConfirm} saving={saving} error={saveError} />
      )}
      <div className={`survey-page${isCoolPhase ? ' phase-cool' : ''}`}>
        <div className="survey-container">
          {step.kind !== 'intro' && step.kind !== 'end' && (
            <Hud answered={progress} total={100} />
          )}

          {step.kind === 'intro' && <IntroScreen onStart={() => setShowNameModal(true)} />}

          {step.kind === 'focus' && <FocusScreen onContinue={goNext} onBack={goBack} />}

          {step.kind === 'q1intro' && (
            <Q1IntroScreen variant={step.key} onContinue={goNext} onBack={goBack} />
          )}

          {step.kind === 'q1' && (
            <>
              <QuestionScreen
                question={step.question}
                index={flow.slice(0, idx).filter((s) => s.kind === 'q1').length}
                total={totalPhase1Questions}
                value={phase1Answers[step.question.id as keyof Phase1Answers]}
                altroValue={phase1Answers.causa_altro}
                onAnswer={(value) => setPhase1Answer(step.question.id, value)}
                onAltroChange={(text) => setPhase1Answer('causa_altro', text)}
                onBack={goBack}
                onNext={() => {
                  void handleQ1Next(step.question)
                }}
              />
              {saving && <div className="save-status">Salvataggio in corso…</div>}
              {saveError && (
                <div className="save-error">
                  <span>{saveError}</span>
                  <button
                    className="btn ghost"
                    onClick={() => {
                      void handleQ1Next(step.question)
                    }}
                  >
                    Riprova
                  </button>
                </div>
              )}
            </>
          )}

          {step.kind === 'result' && <ResultScreen answers={phase1Answers} onContinue={goNext} />}

          {step.kind === 'transition' && <TransitionScreen onContinue={goNext} onBack={goBack} />}

          {step.kind === 'chapter' && (
            <ChapterScreen
              def={step.def}
              chapterIndex={flow.slice(0, idx + 1).filter((s) => s.kind === 'chapter').length}
              chapterTotal={flow.filter((s) => s.kind === 'chapter').length}
              onBack={goBack}
              onContinue={goNext}
            />
          )}

          {step.kind === 'chapterSet' && (
            <ChapterSetScreen
              def={step.def}
              questions={step.questions}
              answers={phase2Answers}
              onAnswer={setPhase2Answer}
              onBack={goBack}
              onNext={goNext}
            />
          )}

          {step.kind === 'end' && (
            <EndScreen
              onRestart={() => {
                setIdx(0)
                setPhase1Answers({})
                setPhase2Answers({})
                setShowNameModal(false)
              }}
            />
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Sostituisci il contenuto di `NameModal.tsx`**

```tsx
// web/src/features/survey/screens/NameModal.tsx
'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { createPortal } from 'react-dom'

function NameModalContent({
  onConfirm,
  saving,
  error,
}: {
  onConfirm: (nome: string, cognome: string) => void
  saving: boolean
  error: string | null
}) {
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (nome.trim() && cognome.trim()) {
      onConfirm(nome.trim(), cognome.trim())
    }
  }

  const valid = nome.trim().length > 0 && cognome.trim().length > 0

  return (
    <div className="name-modal-overlay">
      <div className="name-modal-card">
        <span className="name-modal-badge">Nominativo</span>
        <h2 className="name-modal-title">Prima di iniziare</h2>

        <div className="name-modal-phases">
          <div className="name-modal-phase">
            <span className="name-modal-phase-icon">🔓</span>
            <div>
              <strong>Prima parte — nominativa</strong>
              <p>
                Le risposte di &quot;My Energy Battery&quot; sono{' '}
                <strong>associate al tuo nome</strong>, per permetterci di preparare il tuo{' '}
                <strong>momento di ascolto personalizzato</strong>.
              </p>
            </div>
          </div>
          <div className="name-modal-phase">
            <span className="name-modal-phase-icon">🔒</span>
            <div>
              <strong>Seconda parte — anonima</strong>
              <p>
                I &quot;Fattori Energy Battery&quot; sono <strong>completamente anonimi</strong>:{' '}
                <strong>nessuno saprà mai</strong> chi ha risposto cosa.
              </p>
            </div>
          </div>
        </div>

        <form className="name-modal-form" onSubmit={handleSubmit}>
          <div className="name-modal-field">
            <label className="name-modal-label">Nome</label>
            <input
              className="name-modal-input"
              type="text"
              placeholder="Il tuo nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="name-modal-field">
            <label className="name-modal-label">Cognome</label>
            <input
              className="name-modal-input"
              type="text"
              placeholder="Il tuo cognome"
              value={cognome}
              onChange={(e) => setCognome(e.target.value)}
              required
            />
          </div>
          {error && <div className="name-modal-error">{error}</div>}
          <button className="btn name-modal-submit" type="submit" disabled={!valid || saving}>
            {saving ? 'Salvataggio…' : 'Ho capito, inizio →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export function NameModal({
  onConfirm,
  saving,
  error,
}: {
  onConfirm: (nome: string, cognome: string) => void
  saving: boolean
  error: string | null
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null
  return createPortal(
    <NameModalContent onConfirm={onConfirm} saving={saving} error={error} />,
    document.body
  )
}
```

- [ ] **Step 3: Aggiungi gli stili per stato di salvataggio/errore**

Aggiungi in coda a `web/src/features/survey/survey.css`:

```css
.name-modal-error {
  font-size: 13px;
  color: #ff3d8a;
  background: rgba(255, 61, 138, 0.08);
  border-radius: 10px;
  padding: 10px 14px;
  line-height: 1.45;
  margin-bottom: 10px;
}

.save-status {
  font-size: 13px;
  color: #6b7280;
  margin-top: 8px;
}

.save-error {
  font-size: 13px;
  color: #ff3d8a;
  background: rgba(255, 61, 138, 0.08);
  border-radius: 10px;
  padding: 10px 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

- [ ] **Step 4: Verifica il tipo con la build TypeScript**

Run: `cd web && npx tsc --noEmit`
Expected: nessun errore in tutto il progetto (questo task chiude gli errori
attesi dal Task 6, Step 2)

- [ ] **Step 5: Esegui l'intera suite di test**

Run: `cd web && npm run test`
Expected: PASS, nessuna regressione (questo task non tocca codice coperto
da test automatici — nessun nuovo test atteso qui)

- [ ] **Step 6: Verifica manuale end-to-end (richiede il progetto Supabase reale)**

Con `npm run dev` e una campagna con `compilation_window` aperta:
- compilare nome/cognome + le 4 domande fino alla result screen: verificare
  in Supabase che `submissions.status` sia `'submitted'` e che esistano 6
  righe (7 se si è compilato "Altro") in `nominative_responses`.
- interrompere a metà (es. dopo `termometro`), ricaricare la pagina:
  verificare che il flow riprenda da `causa`, con `clima`/`termometro` già
  precompilati se si torna indietro.
- disattivare la rete del browser e provare a cliccare "Continua" su una
  domanda: verificare che compaia l'errore con "Riprova" e che il flow non
  avanzi.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/survey/SurveyApp.tsx web/src/features/survey/screens/NameModal.tsx web/src/features/survey/survey.css
git commit -m "feat(survey): persist phase-1 answers incrementally with blocking save/retry UI"
```

---

## Prossimi passi (fuori scope di questo piano)

- Persistenza della fase anonima (7 capitoli) — piano separato, dipende
  dalla generazione dello pseudonimo (`anonymous_tokens`) da codice
  server-side privilegiato (`service_role`), come descritto nello schema
  database.
- Modifica di una compilazione già `submitted` (finestra `edit_window`) —
  oggi chi riapre `/survey` con una submission `submitted` vede solo la
  `result` screen, nessuna scrittura ulteriore possibile (coerente con le
  RLS esistenti, che richiedono una `edit_window` aperta).
- UI dashboard HR per creare campagne e aprire le finestre — le campagne
  vanno create manualmente via SQL Editor per ora.
