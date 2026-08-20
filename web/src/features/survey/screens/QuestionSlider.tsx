import { EnergyMascot } from '../mascots'
import type { SliderQuestion } from '../types'

export function QuestionSlider({
  question,
  value,
  onAnswer,
}: {
  question: SliderQuestion
  value?: number
  onAnswer: (level: number) => void
}) {
  const level = value ?? 5
  const message = question.messages[level][1]

  return (
    <div className="slider-wrap">
      <div className="slider-display">
        <EnergyMascot level={level} idPrefix={`slider-${question.id}`} />
        <div className="slider-value">{level}/10</div>
        <div className="slider-msg">{message}</div>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={level}
        onChange={(e) => onAnswer(parseInt(e.target.value, 10))}
        aria-label={question.title}
      />
      <div className="scale-labels">
        <span>Bassa</span>
        <span>Media</span>
        <span>Alta</span>
      </div>
    </div>
  )
}
