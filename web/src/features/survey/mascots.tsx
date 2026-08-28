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
    return `<svg viewBox="0 0 210 140" xmlns="http://www.w3.org/2000/svg">
      <!-- Personaggio sinistra (amber) -->
      <rect x="5" y="86" width="36" height="48" rx="12" fill="hsl(38,80%,92%)" stroke="var(--amber,#FFB648)" stroke-width="3.5"/>
      <rect x="13" y="72" width="14" height="14" rx="5" fill="var(--amber,#FFB648)"/>
      <circle cx="20" cy="100" r="3.5" fill="#2A2338"/><circle cx="34" cy="100" r="3.5" fill="#2A2338"/>
      <path d="M20,110 Q27,115 34,110" fill="none" stroke="#2A2338" stroke-width="2.2" stroke-linecap="round"/>
      <g class="chm-bubble">
        <ellipse cx="16" cy="56" rx="15" ry="11" fill="#fff" stroke="rgba(42,35,56,0.18)" stroke-width="1.5"/>
        <polygon points="14,67 10,74 20,67" fill="#fff"/>
        <text x="16" y="60" font-size="11" text-anchor="middle" fill="#2A2338" font-family="Fredoka, sans-serif">···</text>
      </g>

      <!-- Personaggio centro (teal, più grande) -->
      <rect x="80" y="68" width="50" height="66" rx="17" fill="hsl(160,55%,92%)" stroke="var(--teal,#17B8A6)" stroke-width="4.5"/>
      <rect x="97" y="50" width="16" height="18" rx="5" fill="var(--teal,#17B8A6)"/>
      <circle cx="97" cy="94" r="6.5" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="97" cy="94" r="2.8" fill="#2A2338"/>
      <circle cx="113" cy="94" r="6.5" fill="#fff" stroke="#2A2338" stroke-width="2"/><circle cx="113" cy="94" r="2.8" fill="#2A2338"/>
      <path d="M97,116 Q105,124 113,116" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>
      <g class="chm-bubble" style="animation-delay:0.35s">
        <ellipse cx="105" cy="30" rx="17" ry="13" fill="#fff" stroke="rgba(42,35,56,0.18)" stroke-width="1.5"/>
        <polygon points="100,43 105,50 110,43" fill="#fff"/>
        <text x="105" y="35" font-size="14" text-anchor="middle" fill="var(--teal,#17B8A6)" font-family="Fredoka, sans-serif">♪</text>
      </g>

      <!-- Personaggio destra (coral) -->
      <rect x="169" y="86" width="36" height="48" rx="12" fill="hsl(350,80%,93%)" stroke="var(--coral,#FF6E86)" stroke-width="3.5"/>
      <rect x="177" y="72" width="14" height="14" rx="5" fill="var(--coral,#FF6E86)"/>
      <circle cx="183" cy="100" r="3.5" fill="#2A2338"/><circle cx="197" cy="100" r="3.5" fill="#2A2338"/>
      <path d="M183,110 Q190,115 197,110" fill="none" stroke="#2A2338" stroke-width="2.2" stroke-linecap="round"/>
      <g class="chm-bubble" style="animation-delay:0.7s">
        <ellipse cx="194" cy="56" rx="15" ry="11" fill="#fff" stroke="rgba(42,35,56,0.18)" stroke-width="1.5"/>
        <polygon points="186,67 190,74 196,67" fill="#fff"/>
        <text x="194" y="61" font-size="14" text-anchor="middle" fill="var(--coral,#FF6E86)" font-family="Fredoka, sans-serif">!</text>
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

      <!-- Ragazza (sinistra, animata) -->
      <g class="chm-walk-a" transform="translate(8,84)">
        <!-- Capelli (coral) -->
        <rect x="2" y="-28" width="22" height="20" rx="7" fill="var(--coral,#FF6E86)"/>
        <!-- Coda cavallo -->
        <ellipse cx="25" cy="-18" rx="6" ry="5" fill="var(--coral,#FF6E86)"/>
        <!-- Body -->
        <rect x="0" y="0" width="34" height="46" rx="12" fill="hsl(350,80%,93%)" stroke="var(--coral,#FF6E86)" stroke-width="3.5"/>
        <!-- Testa -->
        <rect x="7" y="-14" width="14" height="16" rx="5" fill="hsl(38,80%,80%)"/>
        <!-- Occhi -->
        <circle cx="11" cy="-7" r="3.5" fill="#2A2338"/>
        <circle cx="18" cy="-7" r="3.5" fill="#2A2338"/>
        <!-- Sorriso -->
        <path d="M10,-1 Q14,3 19,-1" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
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
      <line x1="105" y1="20" x2="105" y2="138" stroke="hsl(255,15%,88%)" stroke-width="1.5" stroke-dasharray="6 5"/>

      <!-- Persona triste (sinistra, seduta) -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,3;0,0" dur="3s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <!-- Body -->
        <rect x="10" y="82" width="42" height="50" rx="14" fill="hsl(220,35%,90%)" stroke="hsl(220,40%,62%)" stroke-width="4"/>
        <!-- Head tab -->
        <rect x="18" y="68" width="16" height="16" rx="5" fill="hsl(220,40%,62%)"/>
        <!-- Sopracciglia tristi -->
        <path d="M18,90 Q24,88 30,90" fill="none" stroke="#2A2338" stroke-width="2" stroke-linecap="round"/>
        <!-- Pupille -->
        <circle cx="21" cy="96" r="3.5" fill="#2A2338"/>
        <circle cx="30" cy="96" r="3.5" fill="#2A2338"/>
        <!-- Bocca triste -->
        <path d="M17,113 Q24,108 31,113" fill="none" stroke="#2A2338" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Lacrimuccia -->
        <ellipse cx="30" cy="101" rx="2" ry="3" fill="hsl(210,80%,70%)">
          <animate attributeName="cy" values="101;108;101" dur="2s" repeatCount="indefinite"/>
        </ellipse>
      </g>
      <!-- Superficie seduta -->
      <line x1="5" y1="132" x2="60" y2="132" stroke="hsl(255,15%,80%)" stroke-width="3"/>

      <!-- Persona felice (destra, salta) -->
      <g transform="translate(148,62)">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-14;0,0" dur="0.75s" repeatCount="indefinite" calcMode="ease-in-out" additive="sum"/>
        <!-- Body -->
        <rect x="0" y="0" width="50" height="64" rx="17" fill="hsl(40,80%,92%)" stroke="var(--amber,#FFB648)" stroke-width="4.5"/>
        <!-- Head tab -->
        <rect x="16" y="-14" width="18" height="16" rx="5" fill="var(--amber,#FFB648)"/>
        <!-- Occhi -->
        <circle cx="16" cy="22" r="6.5" fill="#fff" stroke="#2A2338" stroke-width="2"/>
        <circle cx="16" cy="22" r="2.8" fill="#2A2338"/>
        <circle cx="34" cy="22" r="6.5" fill="#fff" stroke="#2A2338" stroke-width="2"/>
        <circle cx="34" cy="22" r="2.8" fill="#2A2338"/>
        <!-- Sorriso grande -->
        <path d="M10,42 Q25,56 40,42" fill="none" stroke="#2A2338" stroke-width="3" stroke-linecap="round"/>
        <!-- Scintille -->
        <text x="-12" y="10" font-size="10" fill="var(--amber,#FFB648)" font-family="Fredoka, sans-serif" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.1s" repeatCount="indefinite"/>✦
        </text>
        <text x="52" y="6" font-size="10" fill="var(--coral,#FF6E86)" font-family="Fredoka, sans-serif" opacity="0.9">
          <animate attributeName="opacity" values="0.2;0.9;0.2" dur="1.1s" repeatCount="indefinite"/>✦
        </text>
        <text x="54" y="44" font-size="9" fill="var(--amber,#FFB648)" font-family="Fredoka, sans-serif" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.4s" repeatCount="indefinite"/>✦
        </text>
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

      <!-- Linee velocità (dietro il runner) -->
      <g class="chm-speed-lines">
        <line x1="38" y1="100" x2="54" y2="100" stroke="hsl(255,15%,75%)" stroke-width="2" stroke-linecap="round"/>
        <line x1="34" y1="110" x2="52" y2="110" stroke="hsl(255,15%,75%)" stroke-width="2" stroke-linecap="round"/>
        <line x1="40" y1="120" x2="54" y2="120" stroke="hsl(255,15%,75%)" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- Personaggio che corre -->
      <g class="chm-finish-run" transform="translate(55,80)">
        <!-- Body -->
        <rect x="0" y="0" width="54" height="72" rx="20" fill="hsl(160,55%,92%)" stroke="var(--teal,#17B8A6)" stroke-width="4.5"/>
        <!-- Head tab -->
        <rect x="18" y="-16" width="18" height="18" rx="6" fill="var(--teal,#17B8A6)"/>
        <!-- Occhi -->
        <circle cx="18" cy="24" r="8" fill="#fff" stroke="#2A2338" stroke-width="2"/>
        <circle cx="18" cy="24" r="3.4" fill="#2A2338"/>
        <circle cx="36" cy="24" r="8" fill="#fff" stroke="#2A2338" stroke-width="2"/>
        <circle cx="36" cy="24" r="3.4" fill="#2A2338"/>
        <!-- Sorriso -->
        <path d="M14,50 Q27,64 40,50" fill="none" stroke="#2A2338" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Braccia (running pose) -->
        <path d="M0,20 Q-14,14 -12,4" fill="none" stroke="var(--teal,#17B8A6)" stroke-width="7" stroke-linecap="round"/>
        <path d="M54,30 Q68,40 66,54" fill="none" stroke="var(--teal,#17B8A6)" stroke-width="7" stroke-linecap="round"/>
      </g>

      <!-- Polvere dietro il runner -->
      <g class="chm-dust">
        <circle cx="52" cy="148" r="4" fill="hsl(255,15%,80%)"/>
        <circle cx="42" cy="152" r="3" fill="hsl(255,15%,78%)"/>
        <circle cx="55" cy="155" r="2.5" fill="hsl(255,15%,82%)"/>
      </g>
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
