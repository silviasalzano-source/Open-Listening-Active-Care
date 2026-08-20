import type { SingleIconQuestion } from '../types'

export function QuestionSingleIcon({
  question,
  value,
  onAnswer,
}: {
  question: SingleIconQuestion
  value?: string
  onAnswer: (label: string) => void
}) {
  return (
    <div className="options">
      {question.options.map((opt) => (
        <div
          key={opt.label}
          className={`opt-card${value === opt.label ? ' selected' : ''}`}
          onClick={() => onAnswer(opt.label)}
        >
          <div className="opt-icon">{opt.icon}</div>
          <div className="opt-text">
            <b>{opt.label}</b>
            {opt.desc ? <span>{opt.desc}</span> : null}
          </div>
          <div className="opt-check" />
        </div>
      ))}
    </div>
  )
}
