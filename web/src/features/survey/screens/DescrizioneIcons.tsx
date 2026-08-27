'use client'

export function DescrizioneSvg({ label }: { label: string }) {
  if (label === 'Energia in Crescita') return <CrescitaSvg />
  if (label === 'Energia Stabile') return <StabileSvg />
  if (label === 'Energia in Ricarica') return <RicaricaSvg />
  return <AssestamentoSvg />
}

/* ── 1. Energia in Crescita — fulmine che sale con scintille ── */
function CrescitaSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      {/* Freccia/fulmine che sale */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="1.3s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <polygon points="26,8 17,23 23,23 18,38 28,23 22,23" fill="#FF6E86" stroke="#C9562D" strokeWidth="1"/>
      </g>
      {/* Scintilla sinistra */}
      <circle cx="9" cy="24" r="1.5" fill="#FFB648" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1;3;1" dur="1.5s" begin="0.2s" repeatCount="indefinite"/>
      </circle>
      {/* Scintilla destra */}
      <circle cx="35" cy="17" r="1.5" fill="#FFB648" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.7s" repeatCount="indefinite"/>
        <animate attributeName="r" values="1;3;1" dur="1.5s" begin="0.7s" repeatCount="indefinite"/>
      </circle>
      {/* Scintilla alta */}
      <circle cx="22" cy="6" r="1.2" fill="#FF9052" opacity="0">
        <animate attributeName="opacity" values="0;0.9;0" dur="1.5s" begin="1.1s" repeatCount="indefinite"/>
        <animate attributeName="r" values="0.8;2.5;0.8" dur="1.5s" begin="1.1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

/* ── 2. Energia Stabile — batteria piena con livello costante ── */
function StabileSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      {/* Corpo batteria */}
      <rect x="5" y="15" width="32" height="18" rx="4" fill="none" stroke="#17B8A6" strokeWidth="2.5"/>
      {/* Polo positivo */}
      <rect x="37" y="20" width="4" height="8" rx="2" fill="#17B8A6"/>
      {/* Fill stabile ~70% con leggero pulse */}
      <rect x="7.5" y="17.5" width="21" height="13" rx="2.5" fill="#17B8A6">
        <animate attributeName="opacity" values="1;0.75;1" dur="2.2s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
      {/* Linea orizzontale stabile in basso */}
      <line x1="6" y1="38" x2="38" y2="38" stroke="rgba(23,184,166,0.35)" strokeWidth="2" strokeLinecap="round"/>
      {/* Tick ticks della stabilità */}
      <line x1="12" y1="35" x2="12" y2="38" stroke="rgba(23,184,166,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="22" y1="35" x2="22" y2="38" stroke="rgba(23,184,166,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="35" x2="32" y2="38" stroke="rgba(23,184,166,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

/* ── 3. Energia in Ricarica — batteria che si riempie con fulmine ── */
function RicaricaSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      {/* Corpo batteria */}
      <rect x="5" y="15" width="32" height="18" rx="4" fill="none" stroke="#78C7FF" strokeWidth="2.5"/>
      {/* Polo positivo */}
      <rect x="37" y="20" width="4" height="8" rx="2" fill="#78C7FF"/>
      {/* Fill che cresce e decresce (ricarica) */}
      <rect x="7.5" y="17.5" width="4" height="13" rx="2" fill="#78C7FF">
        <animate attributeName="width" values="4;21;4" dur="2s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
      {/* Fulmine di ricarica al centro */}
      <g>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <polygon points="25,11 20,22 24.5,22 19.5,32 28.5,22 24,22" fill="#FFB648"/>
      </g>
    </svg>
  )
}

/* ── 4. Energia in Assestamento — piantina che ondeggia trovando equilibrio ── */
function AssestamentoSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      {/* Vaso/terra */}
      <ellipse cx="22" cy="39" rx="10" ry="4" fill="#C9862B" opacity="0.35"/>
      {/* Stelo + foglie che oscillano dolcemente */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-6 22 38;6 22 38;-6 22 38" dur="2.4s" repeatCount="indefinite" calcMode="ease-in-out"/>
        {/* Stelo */}
        <line x1="22" y1="38" x2="22" y2="18" stroke="#74C97A" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Foglia sinistra */}
        <path d="M22,28 C14,24 10,16 14,11 C16,17 20,24 22,26Z" fill="#74C97A"/>
        {/* Foglia destra */}
        <path d="M22,28 C30,24 34,16 30,11 C28,17 24,24 22,26Z" fill="#5BB85F"/>
        {/* Bocciolo */}
        <circle cx="22" cy="15" r="6" fill="#74C97A"/>
        <circle cx="19" cy="13" r="3.5" fill="#5BB85F"/>
        <circle cx="25" cy="12" r="3" fill="#8DD18F"/>
      </g>
    </svg>
  )
}
