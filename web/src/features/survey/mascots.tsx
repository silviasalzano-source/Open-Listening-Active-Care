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

      <!-- Palazzo OT Consulting -->
      <g>
        <!-- Ombra palazzo -->
        <ellipse cx="130" cy="158" rx="28" ry="4" fill="rgba(42,35,56,0.09)"/>
        <!-- Corpo edificio -->
        <rect x="100" y="82" width="60" height="72" rx="3" fill="#EAF8F6" stroke="#17B8A6" stroke-width="2"/>
        <!-- Tetto a triangolo -->
        <polygon points="95,84 130,58 165,84" fill="#17B8A6"/>
        <!-- Finestre riga 1 -->
        <rect x="109" y="94" width="13" height="14" rx="2" fill="#17B8A6" opacity="0.5"/>
        <rect x="138" y="94" width="13" height="14" rx="2" fill="#17B8A6" opacity="0.5"/>
        <!-- Finestre riga 2 -->
        <rect x="109" y="116" width="13" height="14" rx="2" fill="#17B8A6" opacity="0.5"/>
        <rect x="138" y="116" width="13" height="14" rx="2" fill="#17B8A6" opacity="0.5"/>
        <!-- Porta -->
        <rect x="121" y="134" width="18" height="20" rx="3" fill="#17B8A6"/>
        <!-- Logo OT sul tetto: cerchio rosso con buco -->
        <circle cx="130" cy="68" r="9" fill="#CC2200">
          <animate attributeName="opacity" values="0.85;1;0.85" dur="2.4s" repeatCount="indefinite" calcMode="ease-in-out"/>
        </circle>
        <circle cx="130" cy="68" r="5" fill="white"/>
        <!-- Targhetta OT Consulting -->
        <rect x="104" y="86" width="52" height="14" rx="2" fill="white" opacity="0.9"/>
        <text x="130" y="97" font-size="6.5" font-weight="700" text-anchor="middle" fill="#17B8A6" font-family="Fredoka, sans-serif">OT Consulting</text>
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
    return `<svg viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg">
      <!-- Ombre -->
      <ellipse cx="48" cy="164" rx="20" ry="3.5" fill="rgba(42,35,56,0.08)"/>
      <ellipse cx="130" cy="164" rx="20" ry="3.5" fill="rgba(42,35,56,0.08)"/>
      <ellipse cx="212" cy="164" rx="20" ry="3.5" fill="rgba(42,35,56,0.08)"/>

      <!-- DONNA 1 (sinistra, coral, capelli castani) -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <rect x="38" y="140" width="8" height="22" rx="4" fill="#FF6E86"/>
        <rect x="52" y="140" width="8" height="22" rx="4" fill="#E85A72"/>
        <rect x="33" y="102" width="30" height="40" rx="10" fill="#FF6E86"/>
        <path d="M33,112 Q17,118 19,132" fill="none" stroke="#FF6E86" stroke-width="7" stroke-linecap="round"/>
        <path d="M63,112 Q79,118 77,132" fill="none" stroke="#FF6E86" stroke-width="7" stroke-linecap="round"/>
        <rect x="44" y="92" width="8" height="12" rx="3" fill="#FCD9A0"/>
        <circle cx="48" cy="78" r="14" fill="#FCD9A0"/>
        <path d="M34,74 Q34,60 48,60 Q62,60 62,74 Q60,68 48,68 Q36,68 34,74Z" fill="#5B3A29"/>
        <path d="M33,70 Q29,80 34,90" fill="none" stroke="#5B3A29" stroke-width="6" stroke-linecap="round"/>
        <path d="M63,70 Q67,80 62,90" fill="none" stroke="#5B3A29" stroke-width="6" stroke-linecap="round"/>
        <circle cx="43" cy="78" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="44" cy="77" r="1.3" fill="#2A2338"/>
        <circle cx="53" cy="78" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="54" cy="77" r="1.3" fill="#2A2338"/>
        <path d="M43,86 Q48,91 53,86" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g class="chm-bubble">
        <ellipse cx="26" cy="46" rx="18" ry="12" fill="#fff" stroke="rgba(42,35,56,0.18)" stroke-width="1.5"/>
        <text x="26" y="51" font-size="12" text-anchor="middle" fill="#2A2338" font-family="Fredoka, sans-serif">···</text>
      </g>

      <!-- UOMO (centro, teal, capelli corti scuri) -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2s" begin="0.4s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <rect x="120" y="140" width="8" height="22" rx="4" fill="#17B8A6"/>
        <rect x="134" y="140" width="8" height="22" rx="4" fill="#11988A"/>
        <rect x="115" y="102" width="30" height="40" rx="10" fill="#17B8A6"/>
        <path d="M115,112 Q99,118 101,132" fill="none" stroke="#17B8A6" stroke-width="7" stroke-linecap="round"/>
        <path d="M145,112 Q161,118 159,132" fill="none" stroke="#17B8A6" stroke-width="7" stroke-linecap="round"/>
        <rect x="126" y="92" width="8" height="12" rx="3" fill="#FCD9A0"/>
        <circle cx="130" cy="78" r="14" fill="#FCD9A0"/>
        <path d="M116,76 Q116,62 130,62 Q144,62 144,76 Q142,70 130,70 Q118,70 116,76Z" fill="#2A2338"/>
        <circle cx="125" cy="78" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="126" cy="77" r="1.3" fill="#2A2338"/>
        <circle cx="135" cy="78" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="136" cy="77" r="1.3" fill="#2A2338"/>
        <path d="M125,86 Q130,91 135,86" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g class="chm-bubble" style="animation-delay:0.4s">
        <ellipse cx="130" cy="40" rx="20" ry="13" fill="#fff" stroke="rgba(42,35,56,0.18)" stroke-width="1.5"/>
        <text x="130" y="45" font-size="13" text-anchor="middle" fill="var(--teal,#17B8A6)" font-family="Fredoka, sans-serif">♪</text>
      </g>

      <!-- DONNA 2 (destra, amber, capelli biondi) -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2s" begin="0.8s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <rect x="202" y="140" width="8" height="22" rx="4" fill="#FFB648"/>
        <rect x="216" y="140" width="8" height="22" rx="4" fill="#E8A030"/>
        <rect x="197" y="102" width="30" height="40" rx="10" fill="#FFB648"/>
        <path d="M197,112 Q181,118 183,132" fill="none" stroke="#FFB648" stroke-width="7" stroke-linecap="round"/>
        <path d="M227,112 Q243,118 241,132" fill="none" stroke="#FFB648" stroke-width="7" stroke-linecap="round"/>
        <rect x="208" y="92" width="8" height="12" rx="3" fill="#FCD9A0"/>
        <circle cx="212" cy="78" r="14" fill="#FCD9A0"/>
        <path d="M198,74 Q198,60 212,60 Q226,60 226,74 Q224,68 212,68 Q200,68 198,74Z" fill="#F4C542"/>
        <path d="M197,70 Q193,80 198,90" fill="none" stroke="#F4C542" stroke-width="6" stroke-linecap="round"/>
        <path d="M227,70 Q231,80 226,90" fill="none" stroke="#F4C542" stroke-width="6" stroke-linecap="round"/>
        <circle cx="207" cy="78" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="208" cy="77" r="1.3" fill="#2A2338"/>
        <circle cx="217" cy="78" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="218" cy="77" r="1.3" fill="#2A2338"/>
        <path d="M207,86 Q212,91 217,86" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g class="chm-bubble" style="animation-delay:0.8s">
        <ellipse cx="234" cy="46" rx="18" ry="12" fill="#fff" stroke="rgba(42,35,56,0.18)" stroke-width="1.5"/>
        <text x="234" y="51" font-size="14" text-anchor="middle" fill="var(--coral,#FF6E86)" font-family="Fredoka, sans-serif">!</text>
      </g>
    </svg>`
  }
  if (type === 'growth') {
    return `<svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <!-- Strada -->
      <path d="M10,132 L200,132" fill="none" stroke="hsl(255,15%,78%)" stroke-width="16" stroke-linecap="round"/>
      <path class="chm-road-dash" d="M10,132 L200,132" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="12 10" stroke-linecap="round"/>

      <!-- Palo traguardo -->
      <line x1="186" y1="132" x2="186" y2="52" stroke="#2A2338" stroke-width="3"/>
      <!-- Bandiera a scacchi 3×2 rettangoli 9×8 -->
      <rect x="186" y="52" width="9" height="8" fill="#2A2338"/>
      <rect x="195" y="52" width="9" height="8" fill="#fff" stroke="#2A2338" stroke-width="0.5"/>
      <rect x="204" y="52" width="9" height="8" fill="#2A2338"/>
      <rect x="186" y="60" width="9" height="8" fill="#fff" stroke="#2A2338" stroke-width="0.5"/>
      <rect x="195" y="60" width="9" height="8" fill="#2A2338"/>
      <rect x="204" y="60" width="9" height="8" fill="#fff" stroke="#2A2338" stroke-width="0.5"/>
      <!-- Nastro arrivo -->
      <line x1="172" y1="118" x2="186" y2="118" stroke="var(--coral,#FF6E86)" stroke-width="4" stroke-linecap="round"/>

      <!-- Persona (donna, stile commute) -->
      <g class="chm-walk-a">
        <!-- Ombra -->
        <ellipse cx="31" cy="135" rx="16" ry="3" fill="rgba(42,35,56,0.08)"/>
        <!-- Gambe -->
        <rect x="22" y="112" width="7" height="20" rx="3" fill="#FF6E86"/>
        <rect x="33" y="112" width="7" height="20" rx="3" fill="#E85A72"/>
        <!-- Corpo -->
        <rect x="15" y="78" width="30" height="36" rx="10" fill="#FF6E86"/>
        <!-- Braccia -->
        <path d="M15,88 Q5,93 7,106" fill="none" stroke="#FF6E86" stroke-width="6" stroke-linecap="round"/>
        <path d="M45,88 Q55,93 53,106" fill="none" stroke="#FF6E86" stroke-width="6" stroke-linecap="round"/>
        <!-- Collo -->
        <rect x="27" y="68" width="8" height="12" rx="3" fill="#FCD9A0"/>
        <!-- Testa -->
        <circle cx="31" cy="56" r="14" fill="#FCD9A0"/>
        <!-- Capelli castani (donna, con ciocche laterali) -->
        <path d="M17,52 Q17,38 31,38 Q45,38 45,52 Q43,46 31,46 Q19,46 17,52Z" fill="#5B3A29"/>
        <path d="M16,48 Q12,58 17,68" fill="none" stroke="#5B3A29" stroke-width="6" stroke-linecap="round"/>
        <path d="M46,48 Q50,58 45,68" fill="none" stroke="#5B3A29" stroke-width="6" stroke-linecap="round"/>
        <!-- Occhi -->
        <circle cx="26" cy="56" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="27" cy="55" r="1.3" fill="#2A2338"/>
        <circle cx="36" cy="56" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="37" cy="55" r="1.3" fill="#2A2338"/>
        <!-- Sorriso -->
        <path d="M26,64 Q31,69 36,64" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
      </g>
    </svg>`
  }
  if (type === 'tech') {
    return `<svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <!-- Computer (sinistra) -->
      <!-- Screen -->
      <rect x="14" y="16" width="86" height="60" rx="5" fill="#1A2535" stroke="hsl(220,30%,45%)" stroke-width="3"/>
      <rect x="18" y="20" width="78" height="52" rx="3" fill="hsl(215,60%,14%)"/>
      <!-- Grafico animato sul monitor -->
      <path d="M24,54 Q38,32 52,44 Q66,56 80,34" fill="none" stroke="var(--teal,#17B8A6)" stroke-width="2.5" stroke-dasharray="100">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite"/>
      </path>
      <!-- Cursore lampeggiante -->
      <rect x="82" y="58" width="3" height="11" rx="1" fill="#fff">
        <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/>
      </rect>
      <!-- Base laptop -->
      <rect x="8" y="76" width="98" height="8" rx="2" fill="hsl(220,25%,30%)"/>
      <!-- Tastiera -->
      <rect x="4" y="84" width="106" height="40" rx="5" fill="hsl(220,15%,88%)" stroke="hsl(220,15%,70%)" stroke-width="2"/>
      <!-- Righe tasti -->
      <line x1="14" y1="96" x2="100" y2="96" stroke="hsl(220,10%,68%)" stroke-width="1"/>
      <line x1="14" y1="108" x2="100" y2="108" stroke="hsl(220,10%,68%)" stroke-width="1"/>
      <line x1="14" y1="118" x2="100" y2="118" stroke="hsl(220,10%,68%)" stroke-width="1"/>

      <!-- Bussola (destra) -->
      <circle cx="162" cy="70" r="40" fill="#fff" stroke="hsl(255,15%,72%)" stroke-width="2.5"/>
      <circle cx="162" cy="70" r="34" fill="none" stroke="hsl(255,15%,88%)" stroke-width="1"/>
      <!-- Lettere cardinali -->
      <text x="162" y="38" font-size="11" font-weight="700" text-anchor="middle" fill="#2A2338" font-family="Fredoka, sans-serif">N</text>
      <text x="162" y="112" font-size="11" font-weight="700" text-anchor="middle" fill="#2A2338" font-family="Fredoka, sans-serif">S</text>
      <text x="198" y="74" font-size="11" font-weight="700" text-anchor="middle" fill="#2A2338" font-family="Fredoka, sans-serif">E</text>
      <text x="126" y="74" font-size="11" font-weight="700" text-anchor="middle" fill="#2A2338" font-family="Fredoka, sans-serif">O</text>
      <!-- Ago bussola oscillante -->
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-14 162 70;14 162 70;-14 162 70" dur="3s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <polygon points="162,34 157,70 167,70" fill="var(--coral,#FF6E86)"/>
        <polygon points="162,106 157,70 167,70" fill="hsl(255,15%,55%)"/>
        <circle cx="162" cy="70" r="5" fill="#2A2338"/>
        <circle cx="162" cy="70" r="2.5" fill="#fff"/>
      </g>
    </svg>`
  }
  if (type === 'flow') {
    return `<svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <!-- Linea divisoria centrale -->
      <line x1="105" y1="12" x2="105" y2="136" stroke="hsl(255,15%,88%)" stroke-width="1.5" stroke-dasharray="6 5"/>

      <!-- PERSONA STANCA (sinistra, teal, capelli scuri) -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,4;0,0" dur="3s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <ellipse cx="49" cy="133" rx="18" ry="3" fill="rgba(42,35,56,0.07)"/>
        <rect x="39" y="112" width="7" height="18" rx="3" fill="#17B8A6"/>
        <rect x="51" y="112" width="7" height="18" rx="3" fill="#11988A"/>
        <rect x="33" y="74" width="30" height="40" rx="10" fill="#17B8A6"/>
        <path d="M33,84 Q20,96 22,112" fill="none" stroke="#17B8A6" stroke-width="6" stroke-linecap="round"/>
        <path d="M63,84 Q76,96 74,112" fill="none" stroke="#17B8A6" stroke-width="6" stroke-linecap="round"/>
        <rect x="45" y="64" width="8" height="12" rx="3" fill="#FCD9A0"/>
        <circle cx="49" cy="52" r="14" fill="#FCD9A0"/>
        <path d="M35,48 Q35,34 49,34 Q63,34 63,48 Q61,42 49,42 Q37,42 35,48Z" fill="#2A2338"/>
        <!-- Sopracciglia tristi -->
        <path d="M40,47 Q44,45 48,47" fill="none" stroke="#2A2338" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M50,47 Q54,45 58,47" fill="none" stroke="#2A2338" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="44" cy="52" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="45" cy="53" r="1.3" fill="#2A2338"/>
        <circle cx="54" cy="52" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="55" cy="53" r="1.3" fill="#2A2338"/>
        <!-- Bocca triste -->
        <path d="M44,62 Q49,58 54,62" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
        <!-- Lacrimuccia -->
        <ellipse cx="56" cy="57" rx="2" ry="3" fill="hsl(210,80%,70%)">
          <animate attributeName="cy" values="57;64;57" dur="2s" repeatCount="indefinite"/>
        </ellipse>
      </g>
      <!-- Panchina -->
      <line x1="20" y1="131" x2="80" y2="131" stroke="hsl(255,15%,78%)" stroke-width="3" stroke-linecap="round"/>

      <!-- PERSONA FELICE (destra, coral, capelli biondi, salta) -->
      <g transform="translate(130,0)">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-14;0,0" dur="0.78s" repeatCount="indefinite" calcMode="ease-in-out" additive="sum"/>
        <ellipse cx="30" cy="133" rx="18" ry="3" fill="rgba(42,35,56,0.07)">
          <animate attributeName="rx" values="18;10;18" dur="0.78s" repeatCount="indefinite" calcMode="ease-in-out"/>
        </ellipse>
        <rect x="19" y="112" width="7" height="18" rx="3" fill="#FF6E86"/>
        <rect x="30" y="112" width="7" height="18" rx="3" fill="#E85A72"/>
        <rect x="13" y="74" width="30" height="40" rx="10" fill="#FF6E86"/>
        <!-- Braccia alzate -->
        <path d="M13,80 Q0,60 2,46" fill="none" stroke="#FF6E86" stroke-width="6" stroke-linecap="round"/>
        <path d="M43,80 Q56,60 54,46" fill="none" stroke="#FF6E86" stroke-width="6" stroke-linecap="round"/>
        <rect x="25" y="64" width="8" height="12" rx="3" fill="#FCD9A0"/>
        <circle cx="29" cy="52" r="14" fill="#FCD9A0"/>
        <path d="M15,48 Q15,34 29,34 Q43,34 43,48 Q41,42 29,42 Q17,42 15,48Z" fill="#F4C542"/>
        <path d="M14,44 Q10,54 15,64" fill="none" stroke="#F4C542" stroke-width="6" stroke-linecap="round"/>
        <path d="M44,44 Q48,54 43,64" fill="none" stroke="#F4C542" stroke-width="6" stroke-linecap="round"/>
        <circle cx="24" cy="52" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="25" cy="51" r="1.3" fill="#2A2338"/>
        <circle cx="34" cy="52" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="35" cy="51" r="1.3" fill="#2A2338"/>
        <path d="M22,62 Q29,68 36,62" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Scintille -->
        <text x="-10" y="42" font-size="10" fill="var(--amber,#FFB648)"><animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.1s" repeatCount="indefinite"/>✦</text>
        <text x="50" y="38" font-size="10" fill="var(--coral,#FF6E86)"><animate attributeName="opacity" values="0.2;0.9;0.2" dur="1.1s" repeatCount="indefinite"/>✦</text>
        <text x="52" y="76" font-size="9" fill="var(--amber,#FFB648)"><animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.4s" repeatCount="indefinite"/>✦</text>
      </g>
    </svg>`
  }
  if (type === 'timeline') {
    return `<svg viewBox="0 0 240 190" xmlns="http://www.w3.org/2000/svg">
      <!-- Strada/timeline -->
      <line x1="20" y1="155" x2="220" y2="155" stroke="hsl(255,15%,82%)" stroke-width="5" stroke-linecap="round"/>
      <!-- Sezione futuro tratteggiata (teal) -->
      <line x1="140" y1="155" x2="215" y2="155" stroke="var(--teal,#17B8A6)" stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round"/>

      <!-- Marker Passato -->
      <circle cx="40" cy="155" r="6" fill="hsl(255,15%,68%)"/>
      <text x="40" y="174" font-size="11" text-anchor="middle" fill="hsl(255,15%,50%)" font-family="Fredoka, sans-serif">Passato</text>

      <!-- Marker Presente -->
      <circle cx="120" cy="155" r="8" fill="var(--magenta,#FF3D8A)"/>
      <text x="120" y="139" font-size="12" font-weight="700" text-anchor="middle" fill="var(--magenta,#FF3D8A)" font-family="Fredoka, sans-serif">Presente</text>

      <!-- Marker Futuro -->
      <circle cx="200" cy="155" r="8" fill="var(--amber,#FFB648)"/>
      <text x="200" y="174" font-size="12" font-weight="700" text-anchor="middle" fill="var(--ink,#2A2338)" font-family="Fredoka, sans-serif">Futuro</text>

      <!-- Stella dorata sopra futuro -->
      <text x="200" y="136" font-size="22" text-anchor="middle" fill="var(--amber,#FFB648)" font-family="Fredoka, sans-serif">★</text>

      <!-- Linee velocità -->
      <g class="chm-speed-lines">
        <line x1="30" y1="108" x2="52" y2="108" stroke="hsl(255,15%,75%)" stroke-width="2" stroke-linecap="round"/>
        <line x1="26" y1="118" x2="50" y2="118" stroke="hsl(255,15%,75%)" stroke-width="2" stroke-linecap="round"/>
        <line x1="32" y1="128" x2="52" y2="128" stroke="hsl(255,15%,75%)" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- PERSONA (donna, teal, indica il futuro) -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <ellipse cx="82" cy="157" rx="20" ry="3.5" fill="rgba(42,35,56,0.07)"/>
        <!-- Gambe -->
        <rect x="72" y="135" width="8" height="20" rx="3" fill="#17B8A6"/>
        <rect x="84" y="135" width="8" height="20" rx="3" fill="#11988A"/>
        <!-- Corpo -->
        <rect x="67" y="97" width="30" height="40" rx="10" fill="#17B8A6"/>
        <!-- Braccio che indica il futuro (destra, esteso in avanti) -->
        <path d="M97,107 Q118,98 138,94" fill="none" stroke="#17B8A6" stroke-width="7" stroke-linecap="round"/>
        <!-- Punta del dito -->
        <circle cx="138" cy="94" r="5" fill="#17B8A6"/>
        <!-- Braccio sinistro (dietro) -->
        <path d="M67,107 Q54,114 56,128" fill="none" stroke="#17B8A6" stroke-width="6" stroke-linecap="round"/>
        <!-- Collo -->
        <rect x="78" y="87" width="8" height="12" rx="3" fill="#FCD9A0"/>
        <!-- Testa -->
        <circle cx="82" cy="75" r="14" fill="#FCD9A0"/>
        <!-- Capelli castani -->
        <path d="M68,71 Q68,57 82,57 Q96,57 96,71 Q94,65 82,65 Q70,65 68,71Z" fill="#5B3A29"/>
        <path d="M67,67 Q63,77 68,87" fill="none" stroke="#5B3A29" stroke-width="6" stroke-linecap="round"/>
        <path d="M97,67 Q101,77 96,87" fill="none" stroke="#5B3A29" stroke-width="6" stroke-linecap="round"/>
        <!-- Occhi (guardano a destra) -->
        <circle cx="77" cy="75" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="78" cy="74" r="1.3" fill="#2A2338"/>
        <circle cx="87" cy="75" r="3" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
        <circle cx="88" cy="74" r="1.3" fill="#2A2338"/>
        <!-- Sorriso -->
        <path d="M77,83 Q82,88 87,83" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- Polvere ai piedi -->
      <g class="chm-dust">
        <circle cx="62" cy="152" r="3.5" fill="hsl(255,15%,80%)"/>
        <circle cx="54" cy="156" r="2.5" fill="hsl(255,15%,78%)"/>
      </g>
    </svg>`
  }
  // finish
  return `<svg viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg">
    <!-- Sfondo stelle decorative -->
    <text x="32" y="42" font-size="16" fill="var(--amber,#FFB648)" opacity="0.7"><animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.4s" repeatCount="indefinite"/>★</text>
    <text x="218" y="38" font-size="12" fill="var(--coral,#FF6E86)" opacity="0.6"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.8s" repeatCount="indefinite"/>★</text>
    <text x="240" y="70" font-size="10" fill="var(--amber,#FFB648)" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.1s" repeatCount="indefinite"/>✦</text>
    <text x="16" y="80" font-size="10" fill="var(--teal,#17B8A6)" opacity="0.5"><animate attributeName="opacity" values="0.1;0.6;0.1" dur="1.6s" repeatCount="indefinite"/>✦</text>

    <!-- Persona HR (donna, teal, capelli biondi, pollice su) -->
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="1.8s" repeatCount="indefinite" calcMode="ease-in-out"/>
      <ellipse cx="110" cy="163" rx="22" ry="4" fill="rgba(42,35,56,0.08)"/>
      <!-- Gambe -->
      <rect x="99" y="138" width="9" height="22" rx="4" fill="#17B8A6"/>
      <rect x="113" y="138" width="9" height="22" rx="4" fill="#11988A"/>
      <!-- Corpo -->
      <rect x="94" y="98" width="32" height="42" rx="11" fill="#17B8A6"/>
      <!-- Braccio destro alzato (pollice su) -->
      <path d="M126,108 Q142,90 140,72" fill="none" stroke="#17B8A6" stroke-width="7" stroke-linecap="round"/>
      <!-- Pollice -->
      <circle cx="140" cy="70" r="6" fill="#FCD9A0"/>
      <rect x="137" y="56" width="6" height="16" rx="3" fill="#FCD9A0"/>
      <!-- Braccio sinistro (naturale) -->
      <path d="M94,108 Q80,116 82,130" fill="none" stroke="#17B8A6" stroke-width="7" stroke-linecap="round"/>
      <!-- Collo -->
      <rect x="106" y="88" width="8" height="12" rx="3" fill="#FCD9A0"/>
      <!-- Testa -->
      <circle cx="110" cy="76" r="16" fill="#FCD9A0"/>
      <!-- Capelli biondi -->
      <path d="M94,72 Q94,56 110,56 Q126,56 126,72 Q124,64 110,64 Q96,64 94,72Z" fill="#F4C542"/>
      <path d="M93,68 Q89,80 94,92" fill="none" stroke="#F4C542" stroke-width="7" stroke-linecap="round"/>
      <path d="M127,68 Q131,80 126,92" fill="none" stroke="#F4C542" stroke-width="7" stroke-linecap="round"/>
      <!-- Occhi -->
      <circle cx="104" cy="76" r="3.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
      <circle cx="105" cy="75" r="1.5" fill="#2A2338"/>
      <circle cx="116" cy="76" r="3.5" fill="#fff" stroke="#2A2338" stroke-width="1.5"/>
      <circle cx="117" cy="75" r="1.5" fill="#2A2338"/>
      <!-- Sorriso grande -->
      <path d="M103,87 Q110,94 117,87" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
    </g>

    <!-- Bolla discorso "Dai, manca poco!" -->
    <g class="chm-bubble">
      <rect x="144" y="58" width="104" height="48" rx="14" fill="#fff" stroke="rgba(23,184,166,0.35)" stroke-width="2"/>
      <polygon points="152,106 144,118 164,106" fill="#fff"/>
      <polygon points="152,104 145,116 163,104" fill="#fff" stroke="rgba(23,184,166,0.35)" stroke-width="1"/>
      <text x="196" y="82" font-size="13" font-weight="700" text-anchor="middle" fill="var(--teal,#17B8A6)" font-family="Fredoka, sans-serif">Dai, manca</text>
      <text x="196" y="98" font-size="13" font-weight="700" text-anchor="middle" fill="var(--teal,#17B8A6)" font-family="Fredoka, sans-serif">poco! 💪</text>
    </g>
  </svg>`
}

export function ChapterMascot({ type }: { type: MascotType }) {
  const isLarge = type === 'timeline' || type === 'commute' || type === 'talk' || type === 'finish'
  return (
    <div
      className={`chapter-mascot-stage${isLarge ? ' large' : ''}`}
      dangerouslySetInnerHTML={{ __html: chapterMascotSvgMarkup(type) }}
    />
  )
}
