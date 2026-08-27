import type { SingleIconQuestion } from '../types'
import { WeatherSvg } from './WeatherIcons'
import { DescrizioneSvg } from './DescrizioneIcons'

const WEATHER_LABELS = new Set(['Soleggiato', 'Parzialmente nuvoloso', 'Piovoso', 'Temporalesco'])
const DESCRIZIONE_LABELS = new Set(['Energia in Crescita', 'Energia Stabile', 'Energia in Ricarica', 'Energia in Assestamento'])

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
  const isDescrizione = question.id === 'descrizione'
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
          ) : isDescrizione && DESCRIZIONE_LABELS.has(opt.label) ? (
            <div className="opt-icon opt-icon-weather">
              <DescrizioneSvg label={opt.label} />
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
