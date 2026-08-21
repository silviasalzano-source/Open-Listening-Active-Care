import { mascotBucket } from './flow'

function mascotColor(level: number) {
  const hue = Math.round(((level - 1) / 9) * 160)
  return {
    body: `hsl(${hue},70%,55%)`,
    light: `hsl(${hue},75%,93%)`,
    fill: `hsl(${hue},75%,48%)`,
  }
}

export function mascotAnimClass(level: number): string {
  const bucket = mascotBucket(level)
  if (bucket === 'low' || bucket === 'lowmid') return 'mascot-tired'
  if (bucket === 'mid') return 'mascot-idle'
  if (bucket === 'good') return 'mascot-good'
  return 'mascot-hyper'
}

export function energyMascotSvgMarkup(level: number, clipId: string): string {
  const bucket = mascotBucket(level)
  const color = mascotColor(level)
  const meterH = Math.round(84 * (level / 10))
  const meterY = 130 - meterH

  let eyes = ''
  let brows = ''
  let mouth = ''
  let extras = ''

  if (bucket === 'low') {
    eyes = `<path d="M40,80 L52,80" stroke="#2A2338" stroke-width="3.5" stroke-linecap="round"/><path d="M68,80 L80,80" stroke="#2A2338" stroke-width="3.5" stroke-linecap="round"/>`
    brows = `<path d="M37,69 L51,74" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/><path d="M83,69 L69,74" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>`
    mouth = `<path d="M46,104 Q60,95 74,104" fill="none" stroke="#2A2338" stroke-width="3.5" stroke-linecap="round"/>`
    extras = `<text x="84" y="46" font-size="13" font-weight="700" fill="#8B7FA8" font-family="Fredoka, sans-serif">Zzz</text>
      <ellipse cx="34" cy="66" rx="3.5" ry="5" fill="#8FD3FF" opacity="0.85"/>`
  } else if (bucket === 'lowmid') {
    eyes = `<ellipse cx="46" cy="80" rx="6.5" ry="3.5" fill="#2A2338"/><ellipse cx="74" cy="80" rx="6.5" ry="3.5" fill="#2A2338"/>`
    brows = `<path d="M38,68 L51,71" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/><path d="M82,68 L69,71" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>`
    mouth = `<path d="M47,101 Q60,97 73,101" fill="none" stroke="#2A2338" stroke-width="3.5" stroke-linecap="round"/>`
  } else if (bucket === 'mid') {
    eyes = `<circle cx="46" cy="79" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="46" cy="79" r="3" fill="#2A2338"/>
      <circle cx="74" cy="79" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="74" cy="79" r="3" fill="#2A2338"/>`
    brows = `<path d="M38,66 L51,66" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/><path d="M82,66 L69,66" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>`
    mouth = `<path d="M48,100 L72,100" stroke="#2A2338" stroke-width="3.5" stroke-linecap="round"/>`
  } else if (bucket === 'good') {
    eyes = `<circle cx="46" cy="78" r="7.5" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="47" cy="76" r="3" fill="#2A2338"/><circle cx="49" cy="74" r="1.4" fill="#fff"/>
      <circle cx="74" cy="78" r="7.5" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="75" cy="76" r="3" fill="#2A2338"/><circle cx="77" cy="74" r="1.4" fill="#fff"/>`
    brows = `<path d="M37,63 Q44,58 51,63" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/><path d="M83,63 Q76,58 69,63" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>`
    mouth = `<path d="M45,97 Q60,111 75,97" fill="none" stroke="#2A2338" stroke-width="3.5" stroke-linecap="round"/>`
    extras = `<g class="mascot-spark"><path d="M18,50 L21,57 L28,60 L21,63 L18,70 L15,63 L8,60 L15,57 Z" fill="#FFD24C"/></g>`
  } else {
    eyes = `<circle cx="46" cy="77" r="8" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="47.5" cy="75" r="3.4" fill="#2A2338"/><circle cx="50" cy="72.5" r="1.6" fill="#fff"/>
      <circle cx="74" cy="77" r="8" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="75.5" cy="75" r="3.4" fill="#2A2338"/><circle cx="78" cy="72.5" r="1.6" fill="#fff"/>`
    brows = `<path d="M36,60 Q44,54 52,60" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/><path d="M84,60 Q76,54 68,60" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>`
    mouth = `<path d="M43,95 Q60,120 77,95 Q60,106 43,95 Z" fill="#B8342E" stroke="#2A2338" stroke-width="3"/><path d="M48,98 Q60,104 72,98" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`
    extras = `<g class="mascot-spark"><path d="M16,44 L19,51 L26,54 L19,57 L16,64 L13,57 L6,54 L13,51 Z" fill="#FFD24C"/></g>
      <g class="mascot-spark" style="animation-delay:0.3s"><path d="M100,66 L102,71 L107,73 L102,75 L100,80 L98,75 L93,73 L98,71 Z" fill="#FF8A36"/></g>
      <path d="M20,96 Q10,80 22,66" fill="none" stroke="${color.body}" stroke-width="6" stroke-linecap="round"/>
      <path d="M100,96 Q110,80 98,66" fill="none" stroke="${color.body}" stroke-width="6" stroke-linecap="round"/>`
  }

  return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="24" width="20" height="16" rx="5" fill="${color.body}"/>
    <clipPath id="${clipId}"><rect x="24" y="40" width="72" height="94" rx="22"/></clipPath>
    <rect x="24" y="40" width="72" height="94" rx="22" fill="${color.light}" stroke="${color.body}" stroke-width="4"/>
    <rect clip-path="url(#${clipId})" x="24" y="${meterY}" width="72" height="${meterH}" fill="${color.fill}" opacity="0.32"/>
    ${extras}
    ${brows}
    ${eyes}
    ${mouth}
  </svg>`
}

export function EnergyMascot({ level, idPrefix }: { level: number; idPrefix: string }) {
  return (
    <div
      className={`mascot-wrap ${mascotAnimClass(level)}`}
      dangerouslySetInnerHTML={{ __html: energyMascotSvgMarkup(level, `${idPrefix}-mclip`) }}
    />
  )
}

export function q1IntroMascotSvgMarkup(variant: 'team' | 'anno'): string {
  if (variant === 'team') {
    return `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg">
      <g class="chm-walk-a">
        <rect x="18" y="60" width="42" height="54" rx="14" fill="hsl(28,80%,92%)" stroke="hsl(28,70%,55%)" stroke-width="4"/>
        <rect x="32" y="48" width="14" height="14" rx="4" fill="hsl(28,70%,55%)"/>
        <circle cx="30" cy="82" r="4" fill="#2A2338"/><circle cx="46" cy="82" r="4" fill="#2A2338"/>
        <path d="M30,94 Q38,99 46,94" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="chm-walk-b" style="animation-delay:0.15s">
        <rect x="88" y="40" width="46" height="60" rx="16" fill="hsl(160,55%,92%)" stroke="var(--teal,#17B8A6)" stroke-width="4.5"/>
        <rect x="104" y="26" width="16" height="16" rx="5" fill="var(--teal,#17B8A6)"/>
        <circle cx="103" cy="66" r="5" fill="#2A2338"/><circle cx="119" cy="66" r="5" fill="#2A2338"/>
        <path d="M103,80 Q111,86 119,80" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>
      </g>
      <g class="chm-walk-a" style="animation-delay:0.3s">
        <rect x="160" y="60" width="42" height="54" rx="14" fill="hsl(210,70%,92%)" stroke="hsl(210,60%,55%)" stroke-width="4"/>
        <rect x="174" y="48" width="14" height="14" rx="4" fill="hsl(210,60%,55%)"/>
        <circle cx="172" cy="82" r="4" fill="#2A2338"/><circle cx="188" cy="82" r="4" fill="#2A2338"/>
        <path d="M172,94 Q180,99 188,94" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="chm-bubble"><ellipse cx="34" cy="38" rx="14" ry="11" fill="#fff" stroke="#2A2338" stroke-width="2"/><text x="34" y="42" font-size="12" text-anchor="middle">···</text></g>
      <g class="chm-bubble" style="animation-delay:0.35s"><ellipse cx="176" cy="38" rx="14" ry="11" fill="#fff" stroke="#2A2338" stroke-width="2"/><text x="176" y="42" font-size="12" text-anchor="middle">!</text></g>
    </svg>`
  }
  return `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="80" r="55" fill="none" stroke="rgba(42,35,56,0.15)" stroke-width="3" stroke-dasharray="8 8" class="q1i-rotate"/>
    <rect x="78" y="58" width="44" height="52" rx="14" fill="hsl(45,80%,92%)" stroke="var(--amber,#FFB648)" stroke-width="4"/>
    <rect x="92" y="46" width="16" height="14" rx="4" fill="var(--amber,#FFB648)"/>
    <circle cx="92" cy="80" r="5" fill="#2A2338"/><circle cx="108" cy="80" r="5" fill="#2A2338"/>
    <path d="M92,92 Q100,97 108,92" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
    <g class="q1i-rotate">
      <text x="100" y="22" font-size="22" text-anchor="middle">☀️</text>
      <text x="176" y="86" font-size="22" text-anchor="middle">🍁</text>
      <text x="100" y="148" font-size="22" text-anchor="middle">❄️</text>
      <text x="24" y="86" font-size="22" text-anchor="middle">🌸</text>
    </g>
  </svg>`
}

export function Q1IntroMascot({ variant }: { variant: 'team' | 'anno' }) {
  return (
    <div className="q1intro-mascot" dangerouslySetInnerHTML={{ __html: q1IntroMascotSvgMarkup(variant) }} />
  )
}
