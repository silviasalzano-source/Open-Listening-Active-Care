'use client'

import type { MascotBucket } from '../flow'

const BODY_COLORS: Record<MascotBucket, string> = {
  low:    '#78C7FF',
  lowmid: '#74C97A',
  mid:    '#FFB648',
  good:   '#FF9052',
  high:   '#FF6E86',
}

function faceStr(cx: number, cy: number, bucket: MascotBucket): string {
  const lx = cx - 11, rx = cx + 11
  const ey = cy + 8, my = cy + 20, by = cy - 4

  if (bucket === 'high') return `
    <circle cx="${lx}" cy="${ey}" r="5.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${lx + 1}" cy="${ey - 2}" r="2.5" fill="#2A2338"/>
    <circle cx="${lx + 2.5}" cy="${ey - 3.5}" r="1" fill="#fff"/>
    <circle cx="${rx}" cy="${ey}" r="5.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${rx + 1}" cy="${ey - 2}" r="2.5" fill="#2A2338"/>
    <circle cx="${rx + 2.5}" cy="${ey - 3.5}" r="1" fill="#fff"/>
    <path d="M${cx - 13},${by} Q${lx},${by - 6} ${lx + 9},${by}" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${rx - 9},${by} Q${rx},${by - 6} ${cx + 13},${by}" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${cx - 13},${my - 1} Q${cx},${my + 12} ${cx + 13},${my - 1} Q${cx + 6},${my + 4} ${cx - 6},${my + 4}Z" fill="#FFCEC4" stroke="#2A2338" stroke-width="1.8"/>
    <path d="M${cx - 13},${my - 1} Q${cx - 5},${my + 2} ${cx + 13},${my - 1}" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>
  `

  if (bucket === 'good') return `
    <circle cx="${lx}" cy="${ey}" r="5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${lx + 1}" cy="${ey - 1}" r="2.2" fill="#2A2338"/>
    <circle cx="${lx + 2}" cy="${ey - 2.5}" r="0.9" fill="#fff"/>
    <circle cx="${rx}" cy="${ey}" r="5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${rx + 1}" cy="${ey - 1}" r="2.2" fill="#2A2338"/>
    <circle cx="${rx + 2}" cy="${ey - 2.5}" r="0.9" fill="#fff"/>
    <path d="M${cx - 12},${by} Q${lx},${by - 4} ${lx + 8},${by}" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${rx - 8},${by} Q${rx},${by - 4} ${cx + 12},${by}" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M${cx - 11},${my} Q${cx},${my + 10} ${cx + 11},${my}" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
  `

  if (bucket === 'mid') return `
    <circle cx="${lx}" cy="${ey}" r="4.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${lx}" cy="${ey}" r="2" fill="#2A2338"/>
    <circle cx="${rx}" cy="${ey}" r="4.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="${rx}" cy="${ey}" r="2" fill="#2A2338"/>
    <line x1="${cx - 9}" y1="${my}" x2="${cx + 9}" y2="${my}" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
  `

  if (bucket === 'lowmid') return `
    <ellipse cx="${lx}" cy="${ey}" rx="4.5" ry="3.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <ellipse cx="${lx}" cy="${ey + 1}" rx="2" ry="1.8" fill="#2A2338"/>
    <ellipse cx="${rx}" cy="${ey}" rx="4.5" ry="3.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <ellipse cx="${rx}" cy="${ey + 1}" rx="2" ry="1.8" fill="#2A2338"/>
    <path d="M${lx - 3},${by + 2} L${lx + 3},${by + 5}" stroke="#2A2338" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M${rx + 3},${by + 2} L${rx - 3},${by + 5}" stroke="#2A2338" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M${cx - 9},${my} Q${cx},${my - 2} ${cx + 9},${my}" fill="none" stroke="#2A2338" stroke-width="2.2" stroke-linecap="round"/>
  `

  // low — occhi stanchi ma non spaventosi, piccola smorfia
  return `
    <ellipse cx="${lx}" cy="${ey}" rx="4.5" ry="3.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <ellipse cx="${lx}" cy="${ey + 1}" rx="2" ry="1.6" fill="#2A2338"/>
    <ellipse cx="${rx}" cy="${ey}" rx="4.5" ry="3.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <ellipse cx="${rx}" cy="${ey + 1}" rx="2" ry="1.6" fill="#2A2338"/>
    <path d="M${lx - 3},${by + 2} L${lx + 3},${by + 5}" stroke="#2A2338" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M${rx + 3},${by + 2} L${rx - 3},${by + 5}" stroke="#2A2338" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M${cx - 9},${my} Q${cx},${my - 5} ${cx + 9},${my}" fill="none" stroke="#2A2338" stroke-width="2.2" stroke-linecap="round"/>
  `
}

export function resultFigureSvg(bucket: MascotBucket): string {
  const color = BODY_COLORS[bucket]
  const isHigh = bucket === 'high'
  const isGood = bucket === 'good' || isHigh
  const isLow = bucket === 'low'
  const animClass = isLow ? 'mascot-tired' : isGood ? 'mascot-good' : 'mascot-idle'
  const hairColor = isLow || bucket === 'lowmid' ? '#5B3A29' : '#F4C542'

  const armL = isHigh
    ? 'M44,92 Q26,70 28,52'
    : isGood
      ? 'M44,92 Q28,76 30,62'
      : isLow
        ? 'M44,92 Q28,110 30,126'
        : 'M44,92 Q28,106 30,120'

  const armR = isHigh
    ? 'M76,92 Q94,70 92,52'
    : isGood
      ? 'M76,92 Q92,76 90,62'
      : isLow
        ? 'M76,92 Q92,110 90,126'
        : 'M76,92 Q92,106 90,120'

  return `<svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="194" rx="32" ry="5" fill="rgba(42,35,56,0.07)"/>
    <g class="${animClass}">
      <rect x="44" y="132" width="10" height="28" rx="4" fill="#2A2338"/>
      <rect x="66" y="132" width="10" height="28" rx="4" fill="#2A2338"/>
      <rect x="32" y="80" width="56" height="58" rx="16" fill="${color}"/>
      <path d="${armL}" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round"/>
      <path d="${armR}" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round"/>
      <circle cx="60" cy="50" r="30" fill="#FCD9A0"/>
      <path d="M30,44 Q30,18 60,18 Q90,18 90,44 Q88,30 60,30 Q32,30 30,44Z" fill="${hairColor}"/>
      <path d="M29,40 Q25,56 32,68" fill="none" stroke="${hairColor}" stroke-width="8" stroke-linecap="round"/>
      <path d="M91,40 Q95,56 88,68" fill="none" stroke="${hairColor}" stroke-width="8" stroke-linecap="round"/>
      ${faceStr(60, 50, bucket)}
    </g>
    ${isHigh ? `
      <g class="mascot-spark"><path d="M4,34 L6,40 L12,42 L6,44 L4,50 L2,44 L-4,42 L2,40 Z" fill="#FFD24C"/></g>
      <g class="mascot-spark" style="animation-delay:0.4s"><path d="M116,34 L118,40 L124,42 L118,44 L116,50 L114,44 L108,42 L114,40 Z" fill="#FF8A36"/></g>
    ` : ''}
  </svg>`
}

export function ResultFigure({ bucket }: { bucket: MascotBucket }) {
  return (
    <div
      className="result-figure-svg"
      dangerouslySetInnerHTML={{ __html: resultFigureSvg(bucket) }}
    />
  )
}
