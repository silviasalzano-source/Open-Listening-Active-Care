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
    if (saving) return
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
    if (saving) return
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
                saving={saving}
              />
              {saving && <div className="save-status">Salvataggio in corso…</div>}
              {saveError && (
                <div className="save-error">
                  <span>{saveError}</span>
                  <button
                    className="btn ghost"
                    disabled={saving}
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
