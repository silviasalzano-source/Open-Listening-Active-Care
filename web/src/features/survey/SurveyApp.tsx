'use client'

import { useState } from 'react'
import { buildPhase1Flow } from './flow'
import { IntroScreen } from './screens/IntroScreen'
import { Q1IntroScreen } from './screens/Q1IntroScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { ResultScreen } from './screens/ResultScreen'
import { TransitionScreen } from './screens/TransitionScreen'
import type { Phase1Answers } from './types'
import './survey.css'

const flow = buildPhase1Flow()
const totalQuestions = flow.filter((step) => step.kind === 'q1').length

export function SurveyApp() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Phase1Answers>({})

  function goNext() {
    setIdx((i) => Math.min(i + 1, flow.length - 1))
  }
  function goBack() {
    setIdx((i) => Math.max(i - 1, 0))
  }
  function setAnswer(id: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [id]: value }) as Phase1Answers)
  }

  const step = flow[idx]

  return (
    <div className="survey-page">
      <div className="survey-container">
        {step.kind === 'intro' && <IntroScreen onStart={goNext} />}
        {step.kind === 'q1intro' && <Q1IntroScreen variant={step.key} onContinue={goNext} />}
        {step.kind === 'q1' && (
          <QuestionScreen
            question={step.question}
            index={flow.slice(0, idx).filter((s) => s.kind === 'q1').length}
            total={totalQuestions}
            value={answers[step.question.id as keyof Phase1Answers]}
            altroValue={answers.causa_altro}
            onAnswer={(value) => setAnswer(step.question.id, value)}
            onAltroChange={(text) => setAnswer('causa_altro', text)}
            onBack={goBack}
            onNext={goNext}
          />
        )}
        {step.kind === 'result' && <ResultScreen answers={answers} onContinue={goNext} />}
        {step.kind === 'transition' && <TransitionScreen onContinue={goNext} />}
      </div>
    </div>
  )
}
