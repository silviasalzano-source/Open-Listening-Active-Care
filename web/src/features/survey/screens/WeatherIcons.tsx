'use client'

export function WeatherSvg({ label }: { label: string }) {
  if (label === 'Soleggiato') return <SunSvg />
  if (label === 'Parzialmente nuvoloso') return <PartlyCloudySvg />
  if (label === 'Piovoso') return <RainSvg />
  return <StormSvg />
}

function SunSvg() {
  return (
    <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
      {/* Pulsing glow */}
      <circle cx="26" cy="26" r="14" fill="#FFB648" opacity="0.2">
        <animate attributeName="r" values="12;17;12" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.32;0.2" dur="2.2s" repeatCount="indefinite" />
      </circle>
      {/* Spinning rays */}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 26 26" to="360 26 26" dur="12s" repeatCount="indefinite" />
        <line x1="26" y1="14" x2="26" y2="7" stroke="#FFB648" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34.5" y1="17.5" x2="39.5" y2="12.5" stroke="#FFB648" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="26" x2="45" y2="26" stroke="#FFB648" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34.5" y1="34.5" x2="39.5" y2="39.5" stroke="#FFB648" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="38" x2="26" y2="45" stroke="#FFB648" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="17.5" y1="34.5" x2="12.5" y2="39.5" stroke="#FFB648" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="14" y1="26" x2="7" y2="26" stroke="#FFB648" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="17.5" y1="17.5" x2="12.5" y2="12.5" stroke="#FFB648" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Sun core */}
      <circle cx="26" cy="26" r="10" fill="#FFB648" />
      {/* Highlight */}
      <ellipse cx="22.5" cy="22.5" rx="4" ry="3" fill="#FFDC7F" opacity="0.8" />
    </svg>
  )
}

function PartlyCloudySvg() {
  return (
    <svg viewBox="0 0 52 50" xmlns="http://www.w3.org/2000/svg" width="52" height="50">
      {/* Sun top-right, partly hidden */}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 36 17" to="360 36 17" dur="15s" repeatCount="indefinite" />
        <line x1="36" y1="4" x2="36" y2="8" stroke="#FFB648" strokeWidth="2" strokeLinecap="round" />
        <line x1="43.5" y1="7.5" x2="40.7" y2="10.3" stroke="#FFB648" strokeWidth="2" strokeLinecap="round" />
        <line x1="47" y1="17" x2="43" y2="17" stroke="#FFB648" strokeWidth="2" strokeLinecap="round" />
        <line x1="43.5" y1="26.5" x2="40.7" y2="23.7" stroke="#FFB648" strokeWidth="2" strokeLinecap="round" />
        <line x1="28.5" y1="7.5" x2="31.3" y2="10.3" stroke="#FFB648" strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="36" cy="17" r="8" fill="#FFB648" />
      <ellipse cx="33.5" cy="14.5" rx="3" ry="2" fill="#FFDC7F" opacity="0.75" />

      {/* Cloud drifting slowly */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="4s" repeatCount="indefinite" calcMode="ease-in-out" />
        <circle cx="15" cy="35" r="8" fill="#ECEFF1" />
        <circle cx="26" cy="28" r="10.5" fill="#ECEFF1" />
        <circle cx="37" cy="34" r="8" fill="#ECEFF1" />
        <rect x="7" y="34" width="38" height="11" rx="5.5" fill="#ECEFF1" />
        <circle cx="23" cy="26" r="4" fill="#fff" opacity="0.55" />
      </g>
    </svg>
  )
}

function RainSvg() {
  return (
    <svg viewBox="0 0 52 58" xmlns="http://www.w3.org/2000/svg" width="52" height="58">
      {/* Cloud */}
      <circle cx="16" cy="26" r="9" fill="#90A4AE" />
      <circle cx="27" cy="20" r="11" fill="#90A4AE" />
      <circle cx="37" cy="26" r="9" fill="#90A4AE" />
      <rect x="7" y="26" width="38" height="12" rx="6" fill="#90A4AE" />
      <circle cx="24" cy="18" r="4.5" fill="#B0BEC5" opacity="0.45" />

      {/* Rain drop 1 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;3,11" dur="1s" begin="0s" repeatCount="indefinite" />
        <line x1="15" y1="40" x2="12" y2="49" stroke="#64B5F6" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.65;1" dur="1s" begin="0s" repeatCount="indefinite" />
        </line>
      </g>
      {/* Rain drop 2 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;3,11" dur="1s" begin="0.33s" repeatCount="indefinite" />
        <line x1="27" y1="40" x2="24" y2="49" stroke="#64B5F6" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.65;1" dur="1s" begin="0.33s" repeatCount="indefinite" />
        </line>
      </g>
      {/* Rain drop 3 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;3,11" dur="1s" begin="0.66s" repeatCount="indefinite" />
        <line x1="39" y1="40" x2="36" y2="49" stroke="#64B5F6" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.65;1" dur="1s" begin="0.66s" repeatCount="indefinite" />
        </line>
      </g>
    </svg>
  )
}

function StormSvg() {
  return (
    <svg viewBox="0 0 52 58" xmlns="http://www.w3.org/2000/svg" width="52" height="58">
      {/* Dark storm cloud */}
      <circle cx="16" cy="26" r="9" fill="#546E7A" />
      <circle cx="27" cy="19" r="11" fill="#546E7A" />
      <circle cx="37" cy="25" r="9" fill="#546E7A" />
      <rect x="7" y="25" width="38" height="12" rx="6" fill="#546E7A" />
      <circle cx="24" cy="17" r="4.5" fill="#607D8B" opacity="0.45" />

      {/* Lightning bolt */}
      <path d="M29,34 L21,46 L26.5,46 L19,57 L33,41 L27.5,41 Z" fill="#FDD835">
        <animate
          attributeName="opacity"
          values="0;0;0;1;0.3;1;0;0;0;0;0;0"
          keyTimes="0;0.28;0.34;0.4;0.46;0.52;0.58;0.65;0.75;0.85;0.95;1"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Side rain drops */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;3,10" dur="0.9s" begin="0s" repeatCount="indefinite" />
        <line x1="12" y1="38" x2="9" y2="47" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.65;1" dur="0.9s" begin="0s" repeatCount="indefinite" />
        </line>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;3,10" dur="0.9s" begin="0.45s" repeatCount="indefinite" />
        <line x1="41" y1="38" x2="38" y2="47" stroke="#90CAF9" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.65;1" dur="0.9s" begin="0.45s" repeatCount="indefinite" />
        </line>
      </g>
    </svg>
  )
}
