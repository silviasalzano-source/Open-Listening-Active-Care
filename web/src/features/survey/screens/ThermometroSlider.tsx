'use client'

import type { SliderQuestion } from '../types'
import { mascotBucket } from '../flow'
import type { MascotBucket } from '../flow'

const LEVEL_COLORS: Record<number, string> = {
  1: '#78C7FF', 2: '#78C7FF',
  3: '#74C97A', 4: '#74C97A',
  5: '#FFB648', 6: '#FFB648',
  7: '#FF9052', 8: '#FF9052',
  9: '#FF6E86', 10: '#FF6E86',
}

function faceMarkup(cx: number, cy: number, bucket: MascotBucket): string {
  const lx = cx - 11, rx = cx + 11, ey = cy + 8, my = cy + 20, by = cy - 2
  if (bucket === 'high') return `
    <circle cx="${lx}" cy="${ey}" r="5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${lx + 1}" cy="${ey - 2}" r="2.2" fill="#2A2338"/>
    <circle cx="${lx + 2.5}" cy="${ey - 3.5}" r="0.9" fill="#fff"/>
    <circle cx="${rx}" cy="${ey}" r="5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${rx + 1}" cy="${ey - 2}" r="2.2" fill="#2A2338"/>
    <circle cx="${rx + 2.5}" cy="${ey - 3.5}" r="0.9" fill="#fff"/>
    <path d="M${cx - 13},${by - 3} Q${lx},${by - 8} ${lx + 8},${by - 3}" fill="none" stroke="#2A2338" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M${rx - 8},${by - 3} Q${rx},${by - 8} ${cx + 13},${by - 3}" fill="none" stroke="#2A2338" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M${cx - 12},${my} Q${cx},${my + 13} ${cx + 12},${my} Q${cx},${my + 6} ${cx - 12},${my}Z" fill="#B8342E" stroke="#2A2338" stroke-width="2"/>
    <path d="M${cx - 7},${my + 3} Q${cx},${my + 6} ${cx + 7},${my + 3}" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  `
  if (bucket === 'good') return `
    <circle cx="${lx}" cy="${ey}" r="4.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${lx + 1}" cy="${ey - 1}" r="2" fill="#2A2338"/>
    <circle cx="${rx}" cy="${ey}" r="4.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${rx + 1}" cy="${ey - 1}" r="2" fill="#2A2338"/>
    <path d="M${cx - 13},${by - 1} Q${lx},${by - 5} ${lx + 8},${by - 1}" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${rx - 8},${by - 1} Q${rx},${by - 5} ${cx + 13},${by - 1}" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${cx - 11},${my} Q${cx},${my + 9} ${cx + 11},${my}" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
  `
  if (bucket === 'mid') return `
    <circle cx="${lx}" cy="${ey}" r="4" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${lx}" cy="${ey}" r="1.8" fill="#2A2338"/>
    <circle cx="${rx}" cy="${ey}" r="4" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${rx}" cy="${ey}" r="1.8" fill="#2A2338"/>
    <line x1="${cx - 9}" y1="${my}" x2="${cx + 9}" y2="${my}" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
  `
  if (bucket === 'lowmid') return `
    <ellipse cx="${lx}" cy="${ey}" rx="5" ry="3" fill="#2A2338"/>
    <ellipse cx="${rx}" cy="${ey}" rx="5" ry="3" fill="#2A2338"/>
    <path d="M${lx - 4},${by} L${lx + 2},${by + 3}" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${rx + 4},${by} L${rx - 2},${by + 3}" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${cx - 10},${my} Q${cx},${my - 3} ${cx + 10},${my}" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
  `
  // low
  return `
    <line x1="${lx - 4}" y1="${ey}" x2="${lx + 4}" y2="${ey}" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="${rx - 4}" y1="${ey}" x2="${rx + 4}" y2="${ey}" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M${lx - 3},${by + 1} L${lx + 3},${by + 4}" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${rx + 3},${by + 1} L${rx - 3},${by + 4}" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${cx - 10},${my} Q${cx},${my - 7} ${cx + 10},${my}" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
  `
}

function twoFiguresSvg(level: number): string {
  const bucket = mascotBucket(level)
  const isHyper = bucket === 'high'
  const isGood = bucket === 'good' || isHyper
  const animClass = level <= 3 ? 'mascot-tired' : level <= 6 ? 'mascot-idle' : 'mascot-good'

  const girlArmL = isGood ? 'M28,114 Q13,98 15,84' : 'M28,114 Q14,128 16,142'
  const girlArmR = isGood ? 'M76,114 Q91,98 89,84' : 'M76,114 Q90,128 88,142'
  const boyArmL = isGood ? 'M124,114 Q109,98 111,84' : 'M124,114 Q110,128 112,142'
  const boyArmR = isGood ? 'M172,114 Q187,98 185,84' : 'M172,114 Q186,128 184,142'

  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
    <!-- Ombre pavimento -->
    <ellipse cx="52" cy="214" rx="30" ry="4" fill="rgba(42,35,56,0.07)"/>
    <ellipse cx="148" cy="214" rx="30" ry="4" fill="rgba(42,35,56,0.07)"/>

    <!-- Ragazza (coral, capelli lunghi) -->
    <g class="${animClass}">
      <rect x="38" y="160" width="10" height="26" rx="4" fill="#2A2338"/>
      <rect x="54" y="160" width="10" height="26" rx="4" fill="#2A2338"/>
      <rect x="28" y="102" width="48" height="62" rx="14" fill="#FF6E86"/>
      <rect x="40" y="116" width="28" height="12" rx="3" fill="rgba(255,255,255,0.88)"/>
      <text x="54" y="125" font-size="6" font-weight="700" text-anchor="middle" fill="#2A2338" font-family="Fredoka,sans-serif">HR</text>
      <path d="${girlArmL}" fill="none" stroke="#FF6E86" stroke-width="9" stroke-linecap="round"/>
      <path d="${girlArmR}" fill="none" stroke="#FF6E86" stroke-width="9" stroke-linecap="round"/>
      <circle cx="52" cy="64" r="28" fill="#FCD9A0"/>
      <!-- Capelli lunghi -->
      <path d="M24,58 Q24,28 52,28 Q80,28 80,58 Q77,40 52,40 Q27,40 24,58Z" fill="#F4C542"/>
      <path d="M23,54 Q20,68 24,82 Q26,94 28,104" fill="none" stroke="#F4C542" stroke-width="9" stroke-linecap="round"/>
      <path d="M81,54 Q84,68 80,82 Q78,94 76,104" fill="none" stroke="#F4C542" stroke-width="9" stroke-linecap="round"/>
      ${faceMarkup(52, 64, bucket)}
    </g>

    <!-- Ragazzo (teal, capelli corti) -->
    <g class="${animClass}" style="animation-delay:0.18s">
      <rect x="134" y="160" width="10" height="26" rx="4" fill="#2A2338"/>
      <rect x="150" y="160" width="10" height="26" rx="4" fill="#2A2338"/>
      <rect x="124" y="102" width="48" height="62" rx="14" fill="#17B8A6"/>
      <rect x="136" y="116" width="28" height="12" rx="3" fill="rgba(255,255,255,0.88)"/>
      <text x="150" y="125" font-size="6" font-weight="700" text-anchor="middle" fill="#12232B" font-family="Fredoka,sans-serif">HR</text>
      <path d="${boyArmL}" fill="none" stroke="#17B8A6" stroke-width="9" stroke-linecap="round"/>
      <path d="${boyArmR}" fill="none" stroke="#17B8A6" stroke-width="9" stroke-linecap="round"/>
      <circle cx="148" cy="64" r="28" fill="#FCD9A0"/>
      <!-- Capelli corti -->
      <path d="M120,58 Q120,30 148,30 Q176,30 176,58 Q174,40 148,40 Q122,40 120,58Z" fill="#3D2409"/>
      <path d="M120,52 Q118,62 122,70" fill="none" stroke="#3D2409" stroke-width="6" stroke-linecap="round"/>
      <path d="M176,52 Q178,62 174,70" fill="none" stroke="#3D2409" stroke-width="6" stroke-linecap="round"/>
      ${faceMarkup(148, 64, bucket)}
    </g>

    ${isHyper ? `
    <g class="mascot-spark"><path d="M6,60 L8,66 L14,68 L8,70 L6,76 L4,70 L-2,68 L4,66 Z" fill="#FFD24C"/></g>
    <g class="mascot-spark" style="animation-delay:0.3s"><path d="M194,60 L196,66 L202,68 L196,70 L194,76 L192,70 L186,68 L192,66 Z" fill="#FF8A36"/></g>
    ` : ''}
  </svg>`
}

function Thermometer({ level, onChange }: { level: number; onChange: (l: number) => void }) {
  const color = LEVEL_COLORS[level]
  const fillPercent = (level / 10) * 100

  return (
    <div className="therm-wrap">
      <div className="therm-numbers-left">
        {Array.from({ length: 10 }, (_, i) => {
          const l = 10 - i
          return (
            <button
              key={l}
              type="button"
              className={`therm-num-btn${level >= l ? ' active' : ''}`}
              style={level >= l ? { color } : {}}
              onClick={() => onChange(l)}
            >
              {l}
            </button>
          )
        })}
      </div>

      <div className="therm-tube-wrap">
        <div className="therm-tube">
          <div
            className="therm-fill"
            style={{ height: `${fillPercent}%`, background: `linear-gradient(to top, ${LEVEL_COLORS[1]}, ${color})` }}
          />
          {Array.from({ length: 10 }, (_, i) => {
            const l = 10 - i
            return (
              <button
                key={l}
                type="button"
                className="therm-hit"
                onClick={() => onChange(l)}
                aria-label={`Livello ${l}`}
              />
            )
          })}
        </div>
        <div className="therm-bulb" style={{ background: color }} />
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
  const message = question.messages[level][1]
  const color = LEVEL_COLORS[level]

  return (
    <div className="therm-layout">
      {/* Figures */}
      <div
        className="therm-figures"
        dangerouslySetInnerHTML={{ __html: twoFiguresSvg(level) }}
      />

      {/* Right: thermometer + text */}
      <div className="therm-right">
        <Thermometer level={level} onChange={onAnswer} />

        <div className="therm-info">
          <div className="therm-level-num" style={{ color }}>{level}<span>/10</span></div>
          <div className="therm-msg">{message}</div>
        </div>
      </div>
    </div>
  )
}
