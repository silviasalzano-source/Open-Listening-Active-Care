import type { SingleIconQuestion } from '../types'
import { WeatherSvg } from './WeatherIcons'

const WEATHER_LABELS = new Set(['Soleggiato', 'Parzialmente nuvoloso', 'Piovoso', 'Temporalesco'])

export function QuestionSingleIcon({
  question,
  value,
  onAnswer,
}: {
  question: SingleIconQuestion
  value?: string
  onAnswer: (label: string) => void
}) {
  const isClima = question.id === 'clima'
  return (
    <div className="options">
      {question.options.map((opt) => (
        <button
          type="button"
          key={opt.label}
          className={`opt-card${value === opt.label ? ' selected' : ''}`}
          onClick={() => onAnswer(opt.label)}
        >
          {isClima && WEATHER_LABELS.has(opt.label) ? (
            <div className="opt-icon opt-icon-weather">
              <WeatherSvg label={opt.label} />
            </div>
          ) : (
            <div className="opt-icon">{opt.icon}</div>
          )}
          <div className="opt-text">
            <b>{opt.label}</b>
            {opt.desc ? <span>{opt.desc}</span> : null}
          </div>
          <div className="opt-check" />
        </button>
      ))}
    </div>
  )
}
