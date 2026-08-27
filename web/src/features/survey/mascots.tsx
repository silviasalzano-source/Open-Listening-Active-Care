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
    // Three HR figures in a warm group scene — left (coral), center bigger (teal), right (blue)
    return `<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow floor -->
      <ellipse cx="120" cy="148" rx="88" ry="7" fill="rgba(42,35,56,0.07)"/>

      <!-- Left figure (coral) -->
      <g class="chm-walk-a">
        <ellipse cx="44" cy="146" rx="18" ry="4" fill="rgba(42,35,56,0.05)"/>
        <rect x="36" y="108" width="7" height="34" rx="3" fill="#2A2338"/>
        <rect x="49" y="108" width="7" height="34" rx="3" fill="#2A2338"/>
        <rect x="24" y="68" width="44" height="46" rx="14" fill="#FF6E86"/>
        <!-- Head -->
        <circle cx="46" cy="52" r="18" fill="#FCD9A0"/>
        <!-- Hair -->
        <path d="M28,48 Q28,28 46,28 Q64,28 64,48 Q62,35 46,35 Q30,35 28,48Z" fill="#F4C542"/>
        <path d="M27,44 Q24,56 30,64" fill="none" stroke="#F4C542" stroke-width="6" stroke-linecap="round"/>
        <path d="M65,44 Q68,56 62,64" fill="none" stroke="#F4C542" stroke-width="6" stroke-linecap="round"/>
        <!-- Eyes -->
        <circle cx="40" cy="54" r="3" fill="#2A2338"/>
        <circle cx="52" cy="54" r="3" fill="#2A2338"/>
        <circle cx="41" cy="53" r="1" fill="#fff"/>
        <!-- Smile -->
        <path d="M40,62 Q46,67 52,62" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
        <!-- Wave arm right -->
        <g class="chm-wave-l">
          <path d="M68,80 Q82,66 78,52" fill="none" stroke="#FF6E86" stroke-width="8" stroke-linecap="round"/>
          <circle cx="77" cy="48" r="6" fill="#FCD9A0"/>
        </g>
      </g>

      <!-- Center figure (teal, bigger) -->
      <g class="chm-walk-b" style="animation-delay:0.1s">
        <ellipse cx="120" cy="148" rx="22" ry="5" fill="rgba(42,35,56,0.06)"/>
        <rect x="110" y="106" width="9" height="38" rx="3.5" fill="#2A2338"/>
        <rect x="127" y="106" width="9" height="38" rx="3.5" fill="#2A2338"/>
        <rect x="96" y="62" width="52" height="50" rx="16" fill="#17B8A6"/>
        <!-- Head -->
        <circle cx="122" cy="44" r="22" fill="#FCD9A0"/>
        <!-- Hair dark -->
        <path d="M100,40 Q100,16 122,16 Q144,16 144,40 Q142,24 122,24 Q102,24 100,40Z" fill="#5B3A29"/>
        <path d="M99,36 Q95,52 102,64" fill="none" stroke="#5B3A29" stroke-width="7" stroke-linecap="round"/>
        <path d="M145,36 Q149,52 142,64" fill="none" stroke="#5B3A29" stroke-width="7" stroke-linecap="round"/>
        <!-- Eyes bigger -->
        <circle cx="114" cy="46" r="5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="114" cy="47" r="2.5" fill="#2A2338"/>
        <circle cx="130" cy="46" r="5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="130" cy="47" r="2.5" fill="#2A2338"/>
        <circle cx="115" cy="45" r="1.2" fill="#fff"/>
        <circle cx="131" cy="45" r="1.2" fill="#fff"/>
        <!-- Big smile -->
        <path d="M114,58 Q122,65 130,58" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
      </g>

      <!-- Right figure (blue) -->
      <g class="chm-walk-a" style="animation-delay:0.25s">
        <ellipse cx="196" cy="146" rx="18" ry="4" fill="rgba(42,35,56,0.05)"/>
        <rect x="188" y="108" width="7" height="34" rx="3" fill="#2A2338"/>
        <rect x="201" y="108" width="7" height="34" rx="3" fill="#2A2338"/>
        <rect x="176" y="68" width="44" height="46" rx="14" fill="#2E86DE"/>
        <!-- Head -->
        <circle cx="198" cy="52" r="18" fill="#FCD9A0"/>
        <!-- Hair short dark -->
        <path d="M180,48 Q180,28 198,28 Q216,28 216,48 Q214,35 198,35 Q182,35 180,48Z" fill="#3D2B1F"/>
        <path d="M179,44 Q176,56 182,64" fill="none" stroke="#3D2B1F" stroke-width="6" stroke-linecap="round"/>
        <path d="M217,44 Q220,56 214,64" fill="none" stroke="#3D2B1F" stroke-width="6" stroke-linecap="round"/>
        <!-- Eyes -->
        <circle cx="192" cy="54" r="3" fill="#2A2338"/>
        <circle cx="204" cy="54" r="3" fill="#2A2338"/>
        <circle cx="193" cy="53" r="1" fill="#fff"/>
        <!-- Smile -->
        <path d="M192,62 Q198,67 204,62" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
        <!-- Wave arm left -->
        <g class="chm-wave-r">
          <path d="M172,80 Q158,66 162,52" fill="none" stroke="#2E86DE" stroke-width="8" stroke-linecap="round"/>
          <circle cx="163" cy="48" r="6" fill="#FCD9A0"/>
        </g>
      </g>

      <!-- Speech bubble center -->
      <g class="chm-bubble">
        <rect x="90" y="4" width="64" height="24" rx="10" fill="#fff" stroke="rgba(42,35,56,0.15)" stroke-width="1.5"/>
        <polygon points="118,28 122,36 126,28" fill="#fff" stroke="rgba(42,35,56,0.1)" stroke-width="1"/>
        <text x="122" y="20" font-size="11" text-anchor="middle" fill="#FF6E86" font-family="Fredoka, sans-serif" font-weight="700">Team! 🤝</text>
      </g>
    </svg>`
  }

  // Anno variant — figure with seasonal cycle around it
  return `<svg viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg">
    <!-- Orbit ring -->
    <circle cx="110" cy="88" r="62" fill="none" stroke="rgba(255,182,72,0.2)" stroke-width="3" stroke-dasharray="6 6" class="q1i-rotate"/>

    <!-- Season icons at compass points -->
    <g class="q1i-rotate">
      <!-- Spring (top) -->
      <circle cx="110" cy="22" r="10" fill="rgba(255,182,72,0.12)" stroke="rgba(255,182,72,0.3)" stroke-width="1.5"/>
      <text x="110" y="27" font-size="13" text-anchor="middle">🌸</text>
      <!-- Summer (right) -->
      <circle cx="176" cy="88" r="10" fill="rgba(255,182,72,0.12)" stroke="rgba(255,182,72,0.3)" stroke-width="1.5"/>
      <text x="176" y="93" font-size="13" text-anchor="middle">☀️</text>
      <!-- Autumn (bottom) -->
      <circle cx="110" cy="154" r="10" fill="rgba(255,182,72,0.12)" stroke="rgba(255,182,72,0.3)" stroke-width="1.5"/>
      <text x="110" y="159" font-size="13" text-anchor="middle">🍂</text>
      <!-- Winter (left) -->
      <circle cx="44" cy="88" r="10" fill="rgba(255,182,72,0.12)" stroke="rgba(255,182,72,0.3)" stroke-width="1.5"/>
      <text x="44" y="93" font-size="13" text-anchor="middle">❄️</text>
    </g>

    <!-- Shadow -->
    <ellipse cx="110" cy="148" rx="28" ry="5" fill="rgba(42,35,56,0.08)"/>

    <!-- Legs -->
    <rect x="100" y="120" width="9" height="26" rx="3.5" fill="#2A2338"/>
    <rect x="113" y="120" width="9" height="26" rx="3.5" fill="#2A2338"/>

    <!-- Body (amber maglia) -->
    <rect x="86" y="76" width="48" height="50" rx="15" fill="var(--amber,#FFB648)"/>

    <!-- Head -->
    <circle cx="110" cy="58" r="22" fill="#FCD9A0"/>

    <!-- Hair -->
    <path d="M88,52 Q88,30 110,30 Q132,30 132,52 Q130,38 110,38 Q90,38 88,52Z" fill="#E8954A"/>
    <path d="M87,48 Q83,62 90,72" fill="none" stroke="#E8954A" stroke-width="7" stroke-linecap="round"/>
    <path d="M133,48 Q137,62 130,72" fill="none" stroke="#E8954A" stroke-width="7" stroke-linecap="round"/>

    <!-- Eyes — looking up/around (wonder) -->
    <circle cx="102" cy="59" r="6" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="102" cy="56" r="3" fill="#2A2338"/>
    <circle cx="118" cy="59" r="6" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
    <circle cx="118" cy="56" r="3" fill="#2A2338"/>
    <circle cx="103" cy="55" r="1.2" fill="#fff"/>
    <circle cx="119" cy="55" r="1.2" fill="#fff"/>

    <!-- Eyebrows raised (thoughtful) -->
    <path d="M96,50 Q102,46 108,50" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
    <path d="M112,50 Q118,46 124,50" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>

    <!-- Smile -->
    <path d="M103,70 Q110,76 117,70" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`
}

export function Q1IntroMascot({ variant }: { variant: 'team' | 'anno' }) {
  return (
    <div className="q1intro-mascot" dangerouslySetInnerHTML={{ __html: q1IntroMascotSvgMarkup(variant) }} />
  )
}

export function FocusMascot() {
  const svg = `<svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
    <!-- Ombra pavimento -->
    <ellipse cx="130" cy="172" rx="46" ry="5" fill="rgba(42,35,56,0.07)"/>

    <!-- Corpo che respira piano -->
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-1.5;0,0" dur="3.2s" repeatCount="indefinite" calcMode="ease-in-out"/>

      <!-- Gambe -->
      <rect x="116" y="138" width="13" height="24" rx="5" fill="#2A2338"/>
      <rect x="135" y="138" width="13" height="24" rx="5" fill="#2A2338"/>

      <!-- Corpo (ambra) -->
      <rect x="104" y="86" width="54" height="58" rx="16" fill="var(--amber,#FFB648)"/>

      <!-- Braccio destro (pende) -->
      <path d="M158,100 Q172,112 170,128" fill="none" stroke="var(--amber,#FFB648)" stroke-width="10" stroke-linecap="round"/>

      <!-- Braccio sinistro (piegato verso il mento) -->
      <path d="M104,102 Q82,100 76,84" fill="none" stroke="var(--amber,#FFB648)" stroke-width="10" stroke-linecap="round"/>
      <!-- Mano al mento -->
      <circle cx="74" cy="80" r="8" fill="#FCD9A0"/>

      <!-- Testa -->
      <circle cx="131" cy="60" r="27" fill="#FCD9A0"/>

      <!-- Capelli (castani scuri) -->
      <path d="M104,54 Q104,30 131,30 Q158,30 158,54 Q155,38 131,38 Q107,38 104,54Z" fill="#5C3A1E"/>
      <path d="M103,50 Q100,63 108,73" fill="none" stroke="#5C3A1E" stroke-width="7" stroke-linecap="round"/>
      <path d="M159,50 Q162,63 154,73" fill="none" stroke="#5C3A1E" stroke-width="7" stroke-linecap="round"/>

      <!-- Sopracciglia (espressione pensierosa: sinistra alzata) -->
      <path d="M118,49 Q124,46 130,48" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M132,47 Q138,43 145,46" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>

      <!-- Occhi che guardano in alto a sinistra -->
      <circle cx="123" cy="61" r="6" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
      <circle cx="121" cy="59" r="2.5" fill="#2A2338"/>
      <circle cx="120" cy="58" r="1" fill="#fff"/>

      <circle cx="141" cy="60" r="6" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
      <circle cx="139" cy="58" r="2.5" fill="#2A2338"/>
      <circle cx="138" cy="57" r="1" fill="#fff"/>

      <!-- Bocca socchiusa (pensierosa) -->
      <path d="M122,74 Q131,77 140,74" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
    </g>

    <!-- Puntini bolla pensiero (appaiono in sequenza verso il bubble) -->
    <circle cx="66" cy="68" r="3" fill="#C9C4D6" opacity="0">
      <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.25;0.65;1" dur="2s" begin="0s" repeatCount="indefinite"/>
      <animate attributeName="r" values="2;3.5;2" dur="2s" begin="0s" repeatCount="indefinite"/>
    </circle>
    <circle cx="55" cy="52" r="5" fill="#C9C4D6" opacity="0">
      <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.3;0.65;1" dur="2s" begin="0.35s" repeatCount="indefinite"/>
      <animate attributeName="r" values="3;5.5;3" dur="2s" begin="0.35s" repeatCount="indefinite"/>
    </circle>

    <!-- Bolla pensiero -->
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.4;0.75;1" dur="2s" begin="0.65s" repeatCount="indefinite"/>
      <ellipse cx="36" cy="35" rx="22" ry="17" fill="#fff" stroke="#C9C4D6" stroke-width="2.5"/>
      <text x="36" y="41" font-size="20" text-anchor="middle" fill="var(--amber,#E88A00)" font-family="Fredoka, sans-serif" font-weight="600">?</text>
    </g>
  </svg>`
  return <div className="q1intro-mascot" dangerouslySetInnerHTML={{ __html: svg }} />
}

import type { MascotType } from './types'

function chapterMascotSvgMarkup(type: MascotType): string {
  if (type === 'commute') {
    return `<svg viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg">
      <!-- Ombra a terra -->
      <ellipse cx="52" cy="164" rx="26" ry="4" fill="rgba(42,35,56,0.07)"/>
      <ellipse cx="208" cy="164" rx="26" ry="4" fill="rgba(42,35,56,0.07)"/>

      <!-- Persona sinistra – coral -->
      <g class="chm-walk-a">
        <!-- Gambe -->
        <rect x="41" y="128" width="10" height="30" rx="4" fill="#FF6E86"/>
        <rect x="57" y="128" width="10" height="30" rx="4" fill="#E85A72"/>
        <!-- Corpo -->
        <rect x="32" y="82" width="44" height="52" rx="14" fill="#FF6E86"/>
        <!-- Braccia -->
        <path d="M36,90 Q22,98 24,114" fill="none" stroke="#FF6E86" stroke-width="9" stroke-linecap="round"/>
        <path d="M72,90 Q86,98 84,114" fill="none" stroke="#FF6E86" stroke-width="9" stroke-linecap="round"/>
        <!-- Collo -->
        <rect x="49" y="72" width="10" height="14" rx="4" fill="#FCD9A0"/>
        <!-- Testa -->
        <circle cx="54" cy="60" r="22" fill="#FCD9A0"/>
        <!-- Capelli -->
        <path d="M32,56 Q32,36 54,36 Q76,36 76,56 Q74,44 54,44 Q34,44 32,56Z" fill="#5B3A29"/>
        <path d="M31,52 Q27,64 34,74" fill="none" stroke="#5B3A29" stroke-width="7" stroke-linecap="round"/>
        <path d="M77,52 Q81,64 74,74" fill="none" stroke="#5B3A29" stroke-width="7" stroke-linecap="round"/>
        <!-- Occhi -->
        <circle cx="46" cy="60" r="4" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="47" cy="59" r="1.8" fill="#2A2338"/>
        <circle cx="62" cy="60" r="4" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="63" cy="59" r="1.8" fill="#2A2338"/>
        <!-- Sorriso -->
        <path d="M46,70 Q54,77 62,70" fill="none" stroke="#2A2338" stroke-width="2.2" stroke-linecap="round"/>
      </g>

      <!-- Organigramma centrale -->
      <g>
        <!-- Scatola principale OT Consulting -->
        <rect x="96" y="42" width="68" height="32" rx="8" fill="#17B8A6" opacity="0.95">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="2.5s" repeatCount="indefinite" calcMode="ease-in-out"/>
        </rect>
        <text x="130" y="55" font-size="8.5" font-weight="700" text-anchor="middle" fill="#fff" font-family="Fredoka, sans-serif">OT</text>
        <text x="130" y="68" font-size="7" font-weight="600" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-family="Fredoka, sans-serif">Consulting</text>
        <!-- Linea centrale verticale -->
        <line x1="130" y1="74" x2="130" y2="92" stroke="#2A2338" stroke-width="1.5" opacity="0.25"/>
        <!-- Linea orizzontale -->
        <line x1="96" y1="92" x2="164" y2="92" stroke="#2A2338" stroke-width="1.5" opacity="0.25"/>
        <!-- Tre rami verso il basso -->
        <line x1="96" y1="92" x2="96" y2="108" stroke="#2A2338" stroke-width="1.5" opacity="0.25"/>
        <line x1="130" y1="92" x2="130" y2="108" stroke="#2A2338" stroke-width="1.5" opacity="0.25"/>
        <line x1="164" y1="92" x2="164" y2="108" stroke="#2A2338" stroke-width="1.5" opacity="0.25"/>
        <!-- Box figlio sinistro -->
        <rect x="76" y="108" width="40" height="22" rx="5" fill="#17B8A6" opacity="0.22"/>
        <rect x="76" y="108" width="40" height="22" rx="5" fill="none" stroke="#17B8A6" stroke-width="1.5" opacity="0.55"/>
        <!-- Box figlio centrale -->
        <rect x="110" y="108" width="40" height="22" rx="5" fill="#17B8A6" opacity="0.22"/>
        <rect x="110" y="108" width="40" height="22" rx="5" fill="none" stroke="#17B8A6" stroke-width="1.5" opacity="0.55"/>
        <!-- Box figlio destro -->
        <rect x="144" y="108" width="40" height="22" rx="5" fill="#17B8A6" opacity="0.22"/>
        <rect x="144" y="108" width="40" height="22" rx="5" fill="none" stroke="#17B8A6" stroke-width="1.5" opacity="0.55"/>
        <!-- Stelline decorative -->
        <circle cx="110" cy="28" r="3" fill="#FFB648" opacity="0">
          <animate attributeName="opacity" values="0;0.9;0" dur="2.2s" begin="0s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="24" r="2" fill="#FFB648" opacity="0">
          <animate attributeName="opacity" values="0;0.9;0" dur="2.2s" begin="0.7s" repeatCount="indefinite"/>
        </circle>
      </g>

      <!-- Persona destra – teal -->
      <g class="chm-walk-b">
        <!-- Gambe -->
        <rect x="193" y="128" width="10" height="30" rx="4" fill="#17B8A6"/>
        <rect x="209" y="128" width="10" height="30" rx="4" fill="#11988A"/>
        <!-- Corpo -->
        <rect x="184" y="82" width="44" height="52" rx="14" fill="#17B8A6"/>
        <!-- Braccia -->
        <path d="M188,90 Q174,98 176,114" fill="none" stroke="#17B8A6" stroke-width="9" stroke-linecap="round"/>
        <path d="M224,90 Q238,98 236,114" fill="none" stroke="#17B8A6" stroke-width="9" stroke-linecap="round"/>
        <!-- Collo -->
        <rect x="201" y="72" width="10" height="14" rx="4" fill="#FCD9A0"/>
        <!-- Testa -->
        <circle cx="206" cy="60" r="22" fill="#FCD9A0"/>
        <!-- Capelli -->
        <path d="M184,56 Q184,36 206,36 Q228,36 228,56 Q226,44 206,44 Q186,44 184,56Z" fill="#F4C542"/>
        <path d="M183,52 Q179,64 186,74" fill="none" stroke="#F4C542" stroke-width="7" stroke-linecap="round"/>
        <path d="M229,52 Q233,64 226,74" fill="none" stroke="#F4C542" stroke-width="7" stroke-linecap="round"/>
        <!-- Occhi -->
        <circle cx="198" cy="60" r="4" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="199" cy="59" r="1.8" fill="#2A2338"/>
        <circle cx="214" cy="60" r="4" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="215" cy="59" r="1.8" fill="#2A2338"/>
        <!-- Sorriso -->
        <path d="M198,70 Q206,77 214,70" fill="none" stroke="#2A2338" stroke-width="2.2" stroke-linecap="round"/>
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
  const isLarge = type === 'timeline' || type === 'commute'
  return (
    <div
      className={`chapter-mascot-stage${isLarge ? ' large' : ''}`}
      dangerouslySetInnerHTML={{ __html: chapterMascotSvgMarkup(type) }}
    />
  )
}
