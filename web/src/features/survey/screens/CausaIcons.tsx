'use client'

export function CausaSvg({ label }: { label: string }) {
  if (label === 'Carico di lavoro') return <WorkloadSvg />
  if (label === 'Relazioni con colleghi') return <RelationsSvg />
  if (label === 'Rapporto con il/la responsabile') return <LeaderSvg />
  if (label === 'Crescita e sviluppo professionale') return <GrowthSvg />
  if (label === 'Motivi personali/extra-lavorativi') return <PersonalSvg />
  if (label === 'Strumenti e organizzazione') return <ToolsSvg />
  return <AltroSvg />
}

/* ── 1. Carico di lavoro — stack di fogli, quello in cima si alza ── */
export function WorkloadSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <rect x="6" y="28" width="32" height="12" rx="3" fill="#F0DFC0" stroke="#C9862B" strokeWidth="1.5"/>
      <rect x="7" y="22" width="30" height="12" rx="3" fill="#F8EDD4" stroke="#C9862B" strokeWidth="1.5"/>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="1.8s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <rect x="8" y="14" width="28" height="12" rx="3" fill="#FFB648" stroke="#C9862B" strokeWidth="1.5"/>
        <line x1="12" y1="19" x2="32" y2="19" stroke="rgba(42,35,56,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="12" y1="22.5" x2="26" y2="22.5" stroke="rgba(42,35,56,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  )
}

/* ── 2. Relazioni con colleghi — due teste che si avvicinano ── */
export function RelationsSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      {/* Persona sinistra */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="1.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <circle cx="13" cy="17" r="9" fill="#FF6E86"/>
        <circle cx="11" cy="15" r="3" fill="#fff" opacity="0.55"/>
        <circle cx="11" cy="18" r="1.8" fill="#2A2338"/>
        <circle cx="15" cy="18" r="1.8" fill="#2A2338"/>
        <path d="M10,23 Q13,25.5 16,23" fill="none" stroke="#2A2338" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="5" y="26" width="16" height="12" rx="5" fill="#FF6E86"/>
      </g>
      {/* Persona destra */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;-2,0;0,0" dur="1.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <circle cx="31" cy="17" r="9" fill="#FFB648"/>
        <circle cx="29" cy="15" r="3" fill="#fff" opacity="0.55"/>
        <circle cx="29" cy="18" r="1.8" fill="#2A2338"/>
        <circle cx="33" cy="18" r="1.8" fill="#2A2338"/>
        <path d="M28,23 Q31,25.5 34,23" fill="none" stroke="#2A2338" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="23" y="26" width="16" height="12" rx="5" fill="#FFB648"/>
      </g>
      {/* Connessione centrale */}
      <circle cx="22" cy="17" r="2.5" fill="#C9862B" opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="r" values="1.5;3;1.5" dur="1.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </circle>
    </svg>
  )
}

/* ── 3. Rapporto con responsabile — target con onde che si espandono ── */
export function LeaderSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      {/* Onde espansione */}
      <circle cx="22" cy="22" r="8" fill="none" stroke="#FFB648" strokeWidth="1.5" opacity="0">
        <animate attributeName="r" values="8;19" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="22" cy="22" r="8" fill="none" stroke="#FFB648" strokeWidth="1.5" opacity="0">
        <animate attributeName="r" values="8;19" dur="2s" begin="0.7s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0" dur="2s" begin="0.7s" repeatCount="indefinite"/>
      </circle>
      {/* Cerchi fissi del target */}
      <circle cx="22" cy="22" r="16" fill="none" stroke="rgba(201,134,43,0.25)" strokeWidth="1.5"/>
      <circle cx="22" cy="22" r="10" fill="none" stroke="rgba(201,134,43,0.4)" strokeWidth="1.5"/>
      {/* Nucleo */}
      <circle cx="22" cy="22" r="5" fill="#FF6E86"/>
      <circle cx="20.5" cy="20.5" r="1.8" fill="#fff" opacity="0.6"/>
    </svg>
  )
}

/* ── 4. Crescita e sviluppo — barre che crescono ── */
export function GrowthSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      {/* Base line */}
      <line x1="7" y1="36" x2="37" y2="36" stroke="rgba(42,35,56,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Bar 1 (bassa) */}
      <g>
        <animateTransform attributeName="transform" type="scale" values="1,0.6;1,1;1,0.6" dur="2.2s" begin="0s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <rect x="9" y="24" width="8" height="12" rx="3" fill="#FFB648" style={{transformOrigin:'13px 36px'}}/>
      </g>
      <rect x="9" y="24" width="8" height="12" rx="3" fill="#FFB648">
        <animate attributeName="y" values="30;24;30" dur="2.2s" begin="0s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="height" values="6;12;6" dur="2.2s" begin="0s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
      {/* Bar 2 (media) */}
      <rect x="19" y="18" width="8" height="18" rx="3" fill="#FF9052">
        <animate attributeName="y" values="28;18;28" dur="2.2s" begin="0.3s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="height" values="8;18;8" dur="2.2s" begin="0.3s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
      {/* Bar 3 (alta) */}
      <rect x="29" y="12" width="8" height="24" rx="3" fill="#FF6E86">
        <animate attributeName="y" values="24;12;24" dur="2.2s" begin="0.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="height" values="12;24;12" dur="2.2s" begin="0.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
      {/* Arrow up */}
      <path d="M37,10 L34,14 M37,10 L40,14 M37,10 L37,18" fill="none" stroke="#2A2338" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  )
}

/* ── 5. Motivi personali — casetta con cuore pulsante ── */
export function PersonalSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      {/* Tetto */}
      <polygon points="22,6 38,20 6,20" fill="#FFB648"/>
      <polygon points="22,6 38,20 6,20" fill="none" stroke="#C9862B" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Corpo casa */}
      <rect x="8" y="19" width="28" height="20" rx="2" fill="#F8EDD4" stroke="#C9862B" strokeWidth="1.5"/>
      {/* Porta */}
      <rect x="18" y="28" width="8" height="11" rx="2" fill="#C9862B" opacity="0.35"/>
      {/* Cuore */}
      <g>
        <animate attributeName="transform" values="scale(1);scale(1.25);scale(1)" dur="1.2s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <path d="M22,19 C22,19 27,14 29,16.5 C31,19 27,23 22,27 C17,23 13,19 15,16.5 C17,14 22,19 22,19Z"
          fill="#FF6E86" opacity="0" style={{transformOrigin:'22px 20px'}}>
          <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0" dur="0.1s" repeatCount="0"/>
        </path>
      </g>
      {/* Cuore centrato nel corpo casa */}
      <path d="M22,23.5 C22,23.5 24.5,21 25.5,22.2 C26.5,23.5 24.5,25.5 22,27.5 C19.5,25.5 17.5,23.5 18.5,22.2 C19.5,21 22,23.5 22,23.5Z" fill="#FF6E86">
        <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="1.2s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </path>
    </svg>
  )
}

/* ── 6. Strumenti e organizzazione — ingranaggio che gira ── */
export function ToolsSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="6s" repeatCount="indefinite"/>
        {/* Ingranaggio: cerchio + 8 denti */}
        <circle cx="22" cy="22" r="10" fill="#FFB648"/>
        {/* Denti orizzontali/verticali */}
        <rect x="19" y="6" width="6" height="8" rx="2" fill="#FFB648"/>
        <rect x="19" y="30" width="6" height="8" rx="2" fill="#FFB648"/>
        <rect x="6" y="19" width="8" height="6" rx="2" fill="#FFB648"/>
        <rect x="30" y="19" width="8" height="6" rx="2" fill="#FFB648"/>
        {/* Denti diagonali (45°) */}
        <rect x="28.5" y="8.5" width="6" height="8" rx="2" fill="#FFB648" transform="rotate(45 31.5 12.5)"/>
        <rect x="9.5" y="27.5" width="6" height="8" rx="2" fill="#FFB648" transform="rotate(45 12.5 31.5)"/>
        <rect x="28.5" y="27.5" width="6" height="8" rx="2" fill="#FFB648" transform="rotate(-45 31.5 31.5)"/>
        <rect x="9.5" y="8.5" width="6" height="8" rx="2" fill="#FFB648" transform="rotate(-45 12.5 12.5)"/>
        {/* Foro centrale */}
        <circle cx="22" cy="22" r="5" fill="white"/>
        <circle cx="22" cy="22" r="3" fill="#C9862B" opacity="0.5"/>
      </g>
    </svg>
  )
}

/* ── 7. Altro — matita che scrive ── */
export function AltroSvg() {
  return (
    <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      {/* Matita */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-5 30 14;5 30 14;-5 30 14" dur="1.4s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <rect x="20" y="8" width="10" height="28" rx="3" fill="#FFB648"/>
        <polygon points="20,36 30,36 25,43" fill="#FCD9A0"/>
        <polygon points="22.5,36 27.5,36 25,41" fill="#C9862B" opacity="0.6"/>
        <rect x="20" y="8" width="10" height="6" rx="3" fill="#FF6E86"/>
        <line x1="20" y1="16" x2="30" y2="16" stroke="rgba(42,35,56,0.2)" strokeWidth="1"/>
      </g>
      {/* Linea che appare */}
      <line x1="8" y1="36" x2="18" y2="36" stroke="#C9862B" strokeWidth="2" strokeLinecap="round" opacity="0">
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.3;0.7;1" dur="1.4s" repeatCount="indefinite"/>
        <animate attributeName="x2" values="8;18;18;8" keyTimes="0;0.4;0.7;1" dur="1.4s" repeatCount="indefinite"/>
      </line>
    </svg>
  )
}
