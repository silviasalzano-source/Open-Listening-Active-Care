'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { SliderQuestion } from '../types'

const LEVEL_COLORS: Record<number, string> = {
  1: '#78C7FF', 2: '#78C7FF',
  3: '#74C97A', 4: '#74C97A',
  5: '#FFB648', 6: '#FFB648',
  7: '#FF9052', 8: '#FF9052',
  9: '#FF6E86', 10: '#FF6E86',
}

// Full gradient always visible on the track background
const TRACK_GRADIENT =
  'linear-gradient(to right, #78C7FF 0%, #74C97A 22%, #FFB648 44%, #FF9052 67%, #FF6E86 100%)'

function HorizontalThermometer({
  level,
  onChange,
}: {
  level: number
  onChange: (l: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const getLevel = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return level
      const rect = trackRef.current.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return Math.max(1, Math.min(10, Math.round(ratio * 9) + 1))
    },
    [level],
  )

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => onChange(getLevel(e.clientX))
    const onUp = () => setDragging(false)
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      onChange(getLevel(e.touches[0].clientX))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, getLevel, onChange])

  const fillPercent = ((level - 1) / 9) * 100
  const color = LEVEL_COLORS[level]

  return (
    <div className="therm-h-wrap">
      {/* Clickable track */}
      <div
        className="therm-h-track"
        ref={trackRef}
        onMouseDown={(e) => {
          setDragging(true)
          onChange(getLevel(e.clientX))
        }}
        onTouchStart={(e) => {
          setDragging(true)
          onChange(getLevel(e.touches[0].clientX))
        }}
      >
        {/* Full gradient always visible */}
        <div className="therm-h-gradient" style={{ background: TRACK_GRADIENT }} />
        {/* Semi-transparent mask dims the unselected (right) portion */}
        <div className="therm-h-mask" style={{ left: `${fillPercent}%` }} />
        {/* Draggable handle */}
        <div
          className={`therm-h-handle${dragging ? ' dragging' : ''}`}
          style={{ left: `${fillPercent}%`, background: color }}
          onMouseDown={(e) => {
            e.stopPropagation()
            setDragging(true)
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            setDragging(true)
          }}
        />
      </div>

      {/* Number labels */}
      <div className="therm-h-numbers">
        {Array.from({ length: 10 }, (_, i) => {
          const l = i + 1
          return (
            <button
              key={l}
              type="button"
              className={`therm-h-num${level === l ? ' active' : ''}`}
              style={level === l ? { color } : {}}
              onClick={() => onChange(l)}
            >
              {l}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ThermometroSlider({
  question,
  value,
  onAnswer,
}: {
  question: SliderQuestion
  value?: number
  onAnswer: (level: number) => void
}) {
  const level = value ?? 5
  const fullMsg = question.messages[level][1] as string
  const colonIdx = fullMsg.indexOf(':')
  const title = colonIdx > -1 ? fullMsg.slice(0, colonIdx).trim() : fullMsg
  const subtitle = colonIdx > -1 ? fullMsg.slice(colonIdx + 1).trim() : ''
  const color = LEVEL_COLORS[level]

  return (
    <div className="therm-v2-wrap">
      <HorizontalThermometer level={level} onChange={onAnswer} />
      <div className="therm-v2-text">
        <div className="therm-v2-title" style={{ color }}>
          {title}
        </div>
        {subtitle && <div className="therm-v2-subtitle">{subtitle}</div>}
      </div>
    </div>
  )
}
