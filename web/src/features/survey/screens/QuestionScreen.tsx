import type { Phase1Question } from '../types'
import { QuestionMultiIcon } from './QuestionMultiIcon'
import { QuestionSingleIcon } from './QuestionSingleIcon'
import { QuestionSlider } from './QuestionSlider'

export function QuestionScreen({
  question,
  index,
  total,
  value,
  altroValue,
  onAnswer,
  onAltroChange,
  onBack,
  onNext,
}: {
  question: Phase1Question
  index: number
  total: number
  value: unknown
  altroValue?: string
  onAnswer: (value: unknown) => void
  onAltroChange: (value: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const isAnswered =
    value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0)
  const altroLabel =
    question.type === 'multi-icon' ? question.options.find((o) => o.hasInput)?.label : undefined
  const altroActive = Boolean(altroLabel && Array.isArray(value) && value.includes(altroLabel))
  const altroFilled = Boolean(altroValue && altroValue.trim().length > 0)
  const canContinue = isAnswered && (!altroActive || altroFilled)

  return (
    <div className="survey-screen">
      <div className="q-eyebrow-row">
        <div className="q-eyebrow">
          {index + 1}/{total}
        </div>
        <div className="q-eyebrow-badge">
          {question.id === 'descrizione' ? 'ULTIMO ANNO' : 'OGGI'}
        </div>
      </div>
      <h2 className="q-title">{question.title}</h2>
      {question.sub ? <div className="q-sub">{question.sub}</div> : null}

      {question.type === 'single-icon' && (
        <QuestionSingleIcon
          question={question}
          value={value as string | undefined}
          onAnswer={onAnswer}
        />
      )}
      {question.type === 'multi-icon' && (
        <QuestionMultiIcon
          question={question}
          value={(value as string[] | undefined) ?? []}
          altroValue={altroValue ?? ''}
          onAnswer={onAnswer}
          onAltroChange={onAltroChange}
        />
      )}
      {question.type === 'slider' && (
        <QuestionSlider
          question={question}
          value={value as number | undefined}
          onAnswer={onAnswer}
        />
      )}

      <div className="footer-nav">
        <button className="btn ghost" onClick={onBack}>
          Indietro
        </button>
        <button className="btn" disabled={!canContinue} onClick={onNext}>
          Continua
        </button>
      </div>
    </div>
  )
}
