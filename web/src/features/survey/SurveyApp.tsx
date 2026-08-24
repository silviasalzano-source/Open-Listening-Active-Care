'use client'

import { useState } from 'react'
import { step1 } from './data'
import { buildFullFlow } from './flow'
import { Hud } from './screens/Hud'
import { IntroScreen } from './screens/IntroScreen'
import { Q1IntroScreen } from './screens/Q1IntroScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { ResultScreen } from './screens/ResultScreen'
import { TransitionScreen } from './screens/TransitionScreen'
import { FocusScreen } from './screens/FocusScreen'
import { ChapterScreen } from './screens/ChapterScreen'
import { ChapterSetScreen } from './screens/ChapterSetScreen'
import { EndScreen } from './screens/EndScreen'
import type { Phase1Answers, SurveyAnswers } from './types'
import './survey.css'

const flow = buildFullFlow()
const totalPhase1Questions = step1.length

export function SurveyApp() {
  const [idx, setIdx] = useState(0)
  const [phase1Answers, setPhase1Answers] = useState<Phase1Answers>({})
  const [phase2Answers, setPhase2Answers] = useState<SurveyAnswers>({})

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

  const step = flow[idx]
  const isCoolPhase = step.kind === 'chapter' || step.kind === 'chapterSet' || step.kind === 'end'

  const progress = Math.round((idx / (flow.length - 1)) * 100)

  return (
    <div className={`survey-page${isCoolPhase ? ' phase-cool' : ''}`}>
      <div className="survey-container">
        {step.kind !== 'intro' && step.kind !== 'end' && (
          <Hud answered={progress} total={100} />
        )}

        {step.kind === 'intro' && <IntroScreen onStart={goNext} />}

        {step.kind === 'focus' && <FocusScreen onContinue={goNext} onBack={goBack} />}

        {step.kind === 'q1intro' && <Q1IntroScreen variant={step.key} onContinue={goNext} onBack={goBack} />}

        {step.kind === 'q1' && (
          <QuestionScreen
            question={step.question}
            index={flow.slice(0, idx).filter((s) => s.kind === 'q1').length}
            total={totalPhase1Questions}
            value={phase1Answers[step.question.id as keyof Phase1Answers]}
            altroValue={phase1Answers.causa_altro}
            onAnswer={(value) => setPhase1Answer(step.question.id, value)}
            onAltroChange={(text) => setPhase1Answer('causa_altro', text)}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {step.kind === 'result' && (
          <ResultScreen answers={phase1Answers} onContinue={goNext} />
        )}

        {step.kind === 'transition' && <TransitionScreen onContinue={goNext} onBack={goBack} />}

        {step.kind === 'chapter' && (
          <ChapterScreen
            def={step.def}
            chapterIndex={flow.slice(0, idx + 1).filter(s => s.kind === 'chapter').length}
            chapterTotal={flow.filter(s => s.kind === 'chapter').length}
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

        {step.kind === 'end' && <EndScreen />}
      </div>
    </div>
  )
}
