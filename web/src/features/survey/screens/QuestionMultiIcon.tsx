import type { MultiIconQuestion } from '../types'

export function QuestionMultiIcon({
  question,
  value,
  altroValue,
  onAnswer,
  onAltroChange,
}: {
  question: MultiIconQuestion
  value: string[]
  altroValue: string
  onAnswer: (labels: string[]) => void
  onAltroChange: (text: string) => void
}) {
  const altroLabel = question.options.find((o) => o.hasInput)?.label
  const altroActive = Boolean(altroLabel && value.includes(altroLabel))
  const altroFilled = altroValue.trim().length > 0

  function toggle(label: string) {
    const already = value.includes(label)
    if (already) {
      onAnswer(value.filter((v) => v !== label))
      return
    }
    if (question.max && value.length >= question.max) return
    onAnswer([...value, label])
  }

  return (
    <>
      <div className="options">
        {question.options.map((opt) => (
          <div
            key={opt.label}
            className={`opt-card${value.includes(opt.label) ? ' selected' : ''}`}
            onClick={() => toggle(opt.label)}
          >
            <div className="opt-icon">{opt.icon}</div>
            <div className="opt-text">
              <b>{opt.label}</b>
            </div>
            <div className="opt-check" />
          </div>
        ))}
      </div>
      {altroActive && (
        <input
          className="altro-input"
          placeholder="Scrivi qui la tua risposta…"
          value={altroValue}
          onChange={(e) => onAltroChange(e.target.value)}
        />
      )}
      {altroActive && !altroFilled && (
        <div className="altro-hint">✏️ Scrivi qualcosa per continuare</div>
      )}
      {question.max ? (
        <div className="counter-pill">Puoi scegliere fino a {question.max} opzioni</div>
      ) : null}
    </>
  )
}
