function LockAnimated() {
  return (
    <svg viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg" width="110" height="123">
      {/* Glow pulsante */}
      <circle cx="50" cy="70" r="34" fill="none" stroke="#17B8A6" strokeWidth="2" opacity="0">
        <animate attributeName="r" values="30;50;30" dur="2.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="opacity" values="0.45;0;0.45" dur="2.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </circle>

      {/* Lucchetto che sale e scende dolcemente */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="2.2s" repeatCount="indefinite" calcMode="ease-in-out"/>

        {/* Arco superiore (shackle) */}
        <path d="M30,48 L30,28 Q30,10 50,10 Q70,10 70,28 L70,48"
              fill="none" stroke="#17B8A6" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Corpo del lucchetto */}
        <rect x="13" y="46" width="74" height="56" rx="13" fill="#17B8A6"/>

        {/* Lucina riflesso */}
        <rect x="20" y="54" width="18" height="5" rx="2.5" fill="rgba(255,255,255,0.28)"/>

        {/* Buco serratura */}
        <circle cx="50" cy="69" r="9" fill="rgba(255,255,255,0.22)"/>
        <rect x="46" y="75" width="8" height="14" rx="4" fill="rgba(255,255,255,0.22)"/>
      </g>

      {/* Stellina sinistra che lampeggia */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.6s" repeatCount="indefinite"/>
        <path d="M16,30 L17.4,24 L18.8,30 L25,31.4 L18.8,32.8 L17.4,39 L16,32.8 L9.8,31.4Z" fill="#FFB648"/>
      </g>

      {/* Stellina destra che lampeggia */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.5s" repeatCount="indefinite"/>
        <path d="M82,30 L83.4,24 L84.8,30 L91,31.4 L84.8,32.8 L83.4,39 L82,32.8 L75.8,31.4Z" fill="#FFB648"/>
      </g>
    </svg>
  )
}

export function TransitionScreen({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  return (
    <div className="survey-screen transition">
      <div className="lock-wrap">
        <LockAnimated />
      </div>
      <h2>Da ora in poi, in totale anonimato</h2>
      <div className="transition-body">
        <p>
          Le prossime domande <strong>non sono collegate al tuo profilo</strong>: nessuno
          in azienda potrà risalire a chi ha risposto cosa.
        </p>
        <p>
          Rispondi con la <strong>massima libertà</strong> — è l&apos;unico modo per darci
          un quadro reale di come stanno le persone in OT.
        </p>
      </div>
      <svg className="network-svg" width="220" height="30" viewBox="0 0 220 30">
        <path d="M0 15 L220 15" stroke="#17B8A6" strokeWidth={2} fill="none" opacity={0.8} />
      </svg>
      <button className="btn cool" onClick={onContinue}>
        Continua in anonimato
      </button>
      <button className="btn ghost" onClick={onBack} style={{ marginTop: 8 }}>
        Indietro
      </button>
    </div>
  )
}
