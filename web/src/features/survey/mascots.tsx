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

export function FocusMascot() {
  const svg = `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
    <!-- Cavo dalla presa alla batteria -->
    <path d="M34,110 Q34,130 70,130 Q90,130 90,115" stroke="#8B7FA8" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- Presa elettrica -->
    <rect x="10" y="88" width="48" height="36" rx="10" fill="#E8E4F2" stroke="#8B7FA8" stroke-width="3"/>
    <rect x="24" y="96" width="6" height="12" rx="2" fill="#8B7FA8"/>
    <rect x="38" y="96" width="6" height="12" rx="2" fill="#8B7FA8"/>
    <!-- Batteria corpo -->
    <rect x="70" y="42" width="72" height="88" rx="18" fill="hsl(45,80%,92%)" stroke="var(--amber,#FFB648)" stroke-width="4"/>
    <!-- Terminale batteria -->
    <rect x="96" y="30" width="20" height="14" rx="4" fill="var(--amber,#FFB648)"/>
    <!-- Fill batteria (parziale) -->
    <rect x="74" y="96" width="64" height="30" rx="0" fill="hsl(45,80%,78%)" opacity="0.5" clip-path="url(#batt-clip)"/>
    <clipPath id="batt-clip"><rect x="70" y="42" width="72" height="88" rx="18"/></clipPath>
    <!-- Barre energia interne -->
    <rect x="82" y="100" width="10" height="22" rx="3" fill="var(--amber,#FFB648)" opacity="0.7"/>
    <rect x="97" y="94" width="10" height="28" rx="3" fill="var(--amber,#FFB648)" opacity="0.85"/>
    <rect x="112" y="88" width="10" height="34" rx="3" fill="var(--amber,#FFB648)"/>
    <!-- Occhi (sguardo in su, pensieroso) -->
    <circle cx="92" cy="72" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/>
    <circle cx="92" cy="68" r="3" fill="#2A2338"/>
    <circle cx="118" cy="72" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/>
    <circle cx="118" cy="68" r="3" fill="#2A2338"/>
    <!-- Sopracciglia pensierose -->
    <path d="M84,62 Q91,58 98,62" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M110,62 Q117,58 124,62" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Bocca neutra / pensierosa -->
    <path d="M94,84 Q106,88 118,84" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Bubble pensiero -->
    <circle cx="144" cy="54" r="3" fill="#C9C4D6" class="q1i-think-dot" style="animation-delay:0s"/>
    <circle cx="154" cy="42" r="5" fill="#C9C4D6" class="q1i-think-dot" style="animation-delay:0.2s"/>
    <ellipse cx="168" cy="28" rx="16" ry="12" fill="#fff" stroke="#C9C4D6" stroke-width="2" class="q1i-think-bubble"/>
    <text x="168" y="33" font-size="13" text-anchor="middle" fill="#8B7FA8" font-family="Fredoka, sans-serif" class="q1i-think-bubble">···</text>
  </svg>`
  return <div className="q1intro-mascot" dangerouslySetInnerHTML={{ __html: svg }} />
}

import type { MascotType } from './types'

function chapterMascotSvgMarkup(type: MascotType): string {
  if (type === 'commute') {
    return `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
      <g class="chm-walk-a">
        <rect x="26" y="46" width="52" height="66" rx="16" fill="hsl(340,70%,93%)" stroke="hsl(340,60%,55%)" stroke-width="4"/>
        <rect x="42" y="34" width="20" height="16" rx="5" fill="hsl(340,60%,55%)"/>
        <path d="M40,64 Q31,58 34,50" fill="none" stroke="hsl(340,60%,45%)" stroke-width="4" stroke-linecap="round"/>
        <circle cx="42" cy="72" r="4.5" fill="#2A2338"/><circle cx="62" cy="72" r="4.5" fill="#2A2338"/>
        <path d="M42,86 Q52,94 62,86" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>
        <rect x="34" y="108" width="10" height="26" rx="3" fill="hsl(340,60%,55%)"/>
        <rect x="60" y="108" width="10" height="26" rx="3" fill="hsl(340,60%,45%)"/>
        <rect x="18" y="86" width="16" height="14" rx="3" fill="#8B5E34"/>
      </g>
      <g class="chm-walk-b">
        <rect x="142" y="50" width="52" height="62" rx="16" fill="hsl(195,70%,93%)" stroke="hsl(195,60%,50%)" stroke-width="4"/>
        <rect x="158" y="38" width="20" height="16" rx="5" fill="hsl(195,60%,50%)"/>
        <circle cx="158" cy="76" r="4.5" fill="#2A2338"/><circle cx="178" cy="76" r="4.5" fill="#2A2338"/>
        <path d="M158,90 Q168,98 178,90" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>
        <rect x="150" y="108" width="10" height="26" rx="3" fill="hsl(195,60%,50%)"/>
        <rect x="176" y="108" width="10" height="26" rx="3" fill="hsl(195,60%,40%)"/>
        <rect x="194" y="90" width="16" height="14" rx="3" fill="#8B5E34"/>
      </g>
    </svg>`
  }
  if (type === 'talk') {
    return `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="66" width="46" height="58" rx="14" fill="hsl(28,80%,92%)" stroke="hsl(28,70%,55%)" stroke-width="4"/>
      <circle cx="34" cy="92" r="4" fill="#2A2338"/><circle cx="52" cy="92" r="4" fill="#2A2338"/>
      <path d="M34,104 Q43,109 52,104" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="154" y="66" width="46" height="58" rx="14" fill="hsl(210,80%,93%)" stroke="hsl(210,60%,55%)" stroke-width="4"/>
      <circle cx="168" cy="92" r="4" fill="#2A2338"/><circle cx="186" cy="92" r="4" fill="#2A2338"/>
      <path d="M168,104 Q177,109 186,104" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="82" y="34" width="56" height="70" rx="18" fill="hsl(160,55%,92%)" stroke="var(--teal,#17B8A6)" stroke-width="4.5"/>
      <rect x="102" y="20" width="16" height="16" rx="5" fill="var(--teal,#17B8A6)"/>
      <circle cx="98" cy="64" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="98" cy="64" r="3" fill="#2A2338"/>
      <circle cx="122" cy="64" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="122" cy="64" r="3" fill="#2A2338"/>
      <path d="M100,82 Q110,90 120,82" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>
      <g class="chm-bubble"><ellipse cx="46" cy="46" rx="16" ry="12" fill="#fff" stroke="#2A2338" stroke-width="2"/><text x="46" y="50" font-size="13" text-anchor="middle">···</text></g>
      <g class="chm-bubble" style="animation-delay:0.4s"><ellipse cx="176" cy="46" rx="16" ry="12" fill="#fff" stroke="#2A2338" stroke-width="2"/><text x="176" y="50" font-size="13" text-anchor="middle">!</text></g>
    </svg>`
  }
  if (type === 'growth') {
    return `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,132 Q55,118 58,94 Q60,70 96,60 Q132,50 138,30 Q142,18 172,20" fill="none" stroke="hsl(255,15%,85%)" stroke-width="14" stroke-linecap="round"/>
      <path class="chm-road-dash" d="M20,132 Q55,118 58,94 Q60,70 96,60 Q132,50 138,30 Q142,18 172,20" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 10"/>
      <circle cx="58" cy="94" r="4.5" fill="var(--teal,#17B8A6)"/>
      <circle cx="96" cy="60" r="4.5" fill="var(--teal,#17B8A6)"/>
      <line x1="172" y1="20" x2="172" y2="4" stroke="#2A2338" stroke-width="3"/>
      <polygon points="172,4 192,10 172,16" fill="var(--magenta,#FF3D8A)"/>
      <g class="chm-walk-a" transform="translate(14,126)">
        <rect x="0" y="0" width="34" height="40" rx="12" fill="hsl(150,60%,92%)" stroke="var(--teal,#17B8A6)" stroke-width="3.5"/>
        <rect x="10" y="-10" width="14" height="12" rx="4" fill="var(--teal,#17B8A6)"/>
        <circle cx="10" cy="18" r="4" fill="#2A2338"/><circle cx="24" cy="18" r="4" fill="#2A2338"/>
        <path d="M10,28 Q17,33 24,28" fill="none" stroke="#2A2338" stroke-width="2.2" stroke-linecap="round"/>
      </g>
    </svg>`
  }
  if (type === 'tech') {
    return `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="82" y="42" width="56" height="70" rx="18" fill="hsl(265,55%,93%)" stroke="var(--magenta,#FF3D8A)" stroke-width="4.5"/>
      <rect x="102" y="28" width="16" height="16" rx="5" fill="var(--magenta,#FF3D8A)"/>
      <circle cx="98" cy="72" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="98" cy="72" r="3" fill="#2A2338"/>
      <circle cx="122" cy="72" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="122" cy="72" r="3" fill="#2A2338"/>
      <path d="M100,90 Q110,98 120,90" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>
      <g class="chm-gear">
        <circle cx="182" cy="46" r="17" fill="none" stroke="#8B7FA8" stroke-width="5"/>
        <circle cx="182" cy="46" r="6" fill="#8B7FA8"/>
        <path d="M182,25 L182,15 M182,67 L182,77 M161,46 L151,46 M203,46 L213,46 M167,31 L160,24 M197,31 L204,24 M167,61 L160,68 M197,61 L204,68" stroke="#8B7FA8" stroke-width="4" stroke-linecap="round"/>
      </g>
      <path class="chm-wifi" d="M28,58 Q46,38 64,58" fill="none" stroke="var(--cyan,#2E86DE)" stroke-width="4" stroke-linecap="round"/>
      <path class="chm-wifi" d="M36,66 Q46,54 56,66" fill="none" stroke="var(--cyan,#2E86DE)" stroke-width="4" stroke-linecap="round" style="animation-delay:0.2s"/>
      <circle cx="46" cy="76" r="3.5" fill="var(--cyan,#2E86DE)"/>
    </svg>`
  }
  if (type === 'flow') {
    return `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="82" y="40" width="56" height="76" rx="18" fill="hsl(40,70%,93%)" stroke="var(--amber,#FFB648)" stroke-width="4.5"/>
      <rect x="102" y="26" width="16" height="16" rx="5" fill="var(--amber,#FFB648)"/>
      <rect x="90" y="74" width="40" height="34" rx="6" fill="hsl(40,80%,80%)" opacity="0.6"/>
      <circle cx="98" cy="72" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="98" cy="72" r="3" fill="#2A2338"/>
      <circle cx="122" cy="72" r="7" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="122" cy="72" r="3" fill="#2A2338"/>
      <path d="M100,92 Q110,100 120,92" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>
      <g class="chm-arrow-in">
        <path d="M46,50 L46,86" stroke="var(--teal,#17B8A6)" stroke-width="6" stroke-linecap="round"/>
        <path d="M34,74 L46,90 L58,74" fill="none" stroke="var(--teal,#17B8A6)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <g class="chm-arrow-out">
        <path d="M174,86 L174,50" stroke="var(--coral,#FF6E86)" stroke-width="6" stroke-linecap="round"/>
        <path d="M162,62 L174,46 L186,62" fill="none" stroke="var(--coral,#FF6E86)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`
  }
  if (type === 'timeline') {
    return `<svg viewBox="0 0 240 190" xmlns="http://www.w3.org/2000/svg">
      <rect x="82" y="14" width="76" height="92" rx="22" fill="hsl(160,55%,92%)" stroke="var(--teal,#17B8A6)" stroke-width="5"/>
      <rect x="110" y="0" width="20" height="16" rx="5" fill="var(--teal,#17B8A6)"/>
      <g class="chm-eyes-scan">
        <circle cx="108" cy="58" r="10" fill="#fff" stroke="#2A2338" stroke-width="2.5"/><circle cx="108" cy="58" r="4" fill="#2A2338"/>
        <circle cx="132" cy="58" r="10" fill="#fff" stroke="#2A2338" stroke-width="2.5"/><circle cx="132" cy="58" r="4" fill="#2A2338"/>
      </g>
      <path d="M108,84 Q120,92 132,84" fill="none" stroke="#2A2338" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="30" y1="150" x2="210" y2="150" stroke="#FFD400" stroke-width="5" stroke-linecap="round"/>
      <circle cx="50" cy="150" r="6" fill="hsl(255,15%,68%)"/>
      <text x="50" y="172" font-size="12" text-anchor="middle" fill="var(--ink-dim,#6b6478)" font-family="Fredoka, sans-serif">Passato</text>
      <circle cx="120" cy="150" r="8" fill="var(--magenta,#FF3D8A)"/>
      <text x="120" y="134" font-size="13" font-weight="700" text-anchor="middle" fill="var(--magenta,#FF3D8A)" font-family="Fredoka, sans-serif">Presente</text>
      <line x1="190" y1="150" x2="190" y2="122" stroke="#2A2338" stroke-width="3"/>
      <rect x="190" y="122" width="6" height="6" fill="#2A2338"/><rect x="196" y="122" width="6" height="6" fill="#fff" stroke="#2A2338" stroke-width="1"/>
      <rect x="190" y="128" width="6" height="6" fill="#fff" stroke="#2A2338" stroke-width="1"/><rect x="196" y="128" width="6" height="6" fill="#2A2338"/>
      <text x="190" y="172" font-size="12" font-weight="700" text-anchor="middle" fill="var(--ink,#2A2338)" font-family="Fredoka, sans-serif">Futuro</text>
    </svg>`
  }
  // finish
  return `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
    <line x1="24" y1="128" x2="196" y2="128" stroke="hsl(255,15%,80%)" stroke-width="4"/>
    <rect x="150" y="30" width="6" height="98" fill="#2A2338"/>
    <g>
      <rect x="156" y="30" width="14" height="10" fill="#2A2338"/>
      <rect x="170" y="30" width="14" height="10" fill="#fff" stroke="#2A2338" stroke-width="1"/>
      <rect x="156" y="40" width="14" height="10" fill="#fff" stroke="#2A2338" stroke-width="1"/>
      <rect x="170" y="40" width="14" height="10" fill="#2A2338"/>
    </g>
    <g class="chm-finish-run">
      <rect x="60" y="70" width="48" height="60" rx="16" fill="hsl(150,60%,92%)" stroke="var(--teal,#17B8A6)" stroke-width="4.5"/>
      <rect x="76" y="58" width="16" height="14" rx="4" fill="var(--teal,#17B8A6)"/>
      <circle cx="76" cy="94" r="6" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="76" cy="94" r="2.6" fill="#2A2338"/>
      <circle cx="96" cy="94" r="6" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="96" cy="94" r="2.6" fill="#2A2338"/>
      <path d="M78,110 Q84,116 90,110" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>
      <path d="M50,110 Q40,105 44,96" fill="none" stroke="var(--teal,#17B8A6)" stroke-width="6" stroke-linecap="round"/>
      <path d="M118,120 Q128,110 122,100" fill="none" stroke="var(--teal,#17B8A6)" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g class="chm-dust"><circle cx="46" cy="120" r="3" fill="#C9C4D6"/><circle cx="38" cy="124" r="2.4" fill="#C9C4D6"/></g>
  </svg>`
}

export function ChapterMascot({ type }: { type: MascotType }) {
  const isLarge = type === 'timeline'
  return (
    <div
      className={`chapter-mascot-stage${isLarge ? ' large' : ''}`}
      dangerouslySetInnerHTML={{ __html: chapterMascotSvgMarkup(type) }}
    />
  )
}
