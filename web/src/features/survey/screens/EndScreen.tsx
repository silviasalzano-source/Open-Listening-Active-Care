export function EndScreen() {
  return (
    <div className="survey-screen end">
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed static asset */}
      <img src="/ot-logo-full.svg" alt="OT Consulting" className="intro-logo" />
      <div className="end-stage">
        <svg className="end-hr-duo" viewBox="0 0 330 170" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="165" cy="160" rx="145" ry="8" fill="rgba(42,35,56,0.06)" />

          {/* Figure A — sinistra, bionda, maglia corallo, pollice su */}
          <g className="end-figure end-figure-a">
            <rect x="38" y="120" width="10" height="34" rx="3" fill="#2A2338" />
            <rect x="58" y="120" width="10" height="34" rx="3" fill="#2A2338" />
            <rect x="30" y="66" width="46" height="60" rx="16" fill="#FF6E86" />
            <rect x="42" y="86" width="22" height="14" rx="3" fill="#fff" />
            <text x="53" y="97" fontSize="9" fontWeight="700" textAnchor="middle" fill="#2A2338" fontFamily="Fredoka, sans-serif">HR</text>
            <circle cx="53" cy="46" r="20" fill="#FCD9A0" />
            <path d="M33,44 Q33,20 53,20 Q73,20 73,44 Q70,30 53,30 Q36,30 33,44Z" fill="#F4C542" />
            <path d="M31,40 Q28,60 36,70" fill="none" stroke="#F4C542" strokeWidth="8" strokeLinecap="round" />
            <path d="M75,40 Q78,60 70,70" fill="none" stroke="#F4C542" strokeWidth="8" strokeLinecap="round" />
            <circle cx="46" cy="48" r="2.4" fill="#2A2338" /><circle cx="60" cy="48" r="2.4" fill="#2A2338" />
            <path d="M46,56 Q53,61 60,56" fill="none" stroke="#2A2338" strokeWidth="2.2" strokeLinecap="round" />
            <g className="end-thumb">
              <path d="M30,78 Q14,70 10,52" fill="none" stroke="#FF6E86" strokeWidth="10" strokeLinecap="round" />
              <circle cx="9" cy="48" r="7" fill="#FCD9A0" />
              <rect x="5" y="36" width="6" height="14" rx="3" fill="#FCD9A0" />
            </g>
          </g>

          {/* Figure C — centro, capelli corti grigi, maglia viola, saluto */}
          <g className="end-figure end-figure-c">
            <rect x="155" y="120" width="10" height="34" rx="3" fill="#2A2338" />
            <rect x="175" y="120" width="10" height="34" rx="3" fill="#2A2338" />
            <rect x="142" y="66" width="46" height="60" rx="16" fill="#9575CD" />
            <rect x="154" y="86" width="22" height="14" rx="3" fill="#fff" />
            <text x="165" y="97" fontSize="9" fontWeight="700" textAnchor="middle" fill="#2A2338" fontFamily="Fredoka, sans-serif">HR</text>
            <circle cx="165" cy="46" r="20" fill="#FCD9A0" />
            {/* Capelli a spazzola — top piatto con ciuffi dritti e lati corti */}
            <rect x="147" y="28" width="36" height="14" rx="2" fill="#9E9E9E" />
            <line x1="153" y1="28" x2="153" y2="20" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
            <line x1="160" y1="28" x2="160" y2="19" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
            <line x1="167" y1="28" x2="167" y2="19" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
            <line x1="174" y1="28" x2="174" y2="19" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
            <line x1="181" y1="28" x2="181" y2="20" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
            <rect x="144" y="36" width="5" height="14" rx="2" fill="#9E9E9E" />
            <rect x="184" y="36" width="5" height="14" rx="2" fill="#9E9E9E" />
            <circle cx="158" cy="48" r="2.4" fill="#2A2338" /><circle cx="172" cy="48" r="2.4" fill="#2A2338" />
            <path d="M158,56 Q165,62 172,56" fill="none" stroke="#2A2338" strokeWidth="2.2" strokeLinecap="round" />
            {/* Braccio che saluta */}
            <g className="end-wave">
              <path d="M188,76 Q206,56 200,38" fill="none" stroke="#9575CD" strokeWidth="10" strokeLinecap="round" />
              <circle cx="199" cy="34" r="7" fill="#FCD9A0" />
              <rect x="195" y="22" width="6" height="14" rx="3" fill="#FCD9A0" />
            </g>
          </g>

          {/* Figure B — destra, capelli castani, maglia teal, pollice su */}
          <g className="end-figure end-figure-b">
            <rect x="262" y="120" width="10" height="34" rx="3" fill="#2A2338" />
            <rect x="282" y="120" width="10" height="34" rx="3" fill="#2A2338" />
            <rect x="254" y="66" width="46" height="60" rx="16" fill="#17B8A6" />
            <rect x="266" y="86" width="22" height="14" rx="3" fill="#fff" />
            <text x="277" y="97" fontSize="9" fontWeight="700" textAnchor="middle" fill="#2A2338" fontFamily="Fredoka, sans-serif">HR</text>
            <circle cx="277" cy="46" r="20" fill="#FCD9A0" />
            <path d="M257,44 Q257,20 277,20 Q297,20 297,44 Q294,30 277,30 Q260,30 257,44Z" fill="#5B3A29" />
            <path d="M255,40 Q252,60 260,70" fill="none" stroke="#5B3A29" strokeWidth="8" strokeLinecap="round" />
            <path d="M299,40 Q302,60 294,70" fill="none" stroke="#5B3A29" strokeWidth="8" strokeLinecap="round" />
            <circle cx="270" cy="48" r="2.4" fill="#2A2338" /><circle cx="284" cy="48" r="2.4" fill="#2A2338" />
            <path d="M270,56 Q277,61 284,56" fill="none" stroke="#2A2338" strokeWidth="2.2" strokeLinecap="round" />
            <g className="end-thumb" style={{ animationDelay: '0.2s' }}>
              <path d="M298,78 Q314,70 318,52" fill="none" stroke="#17B8A6" strokeWidth="10" strokeLinecap="round" />
              <circle cx="319" cy="48" r="7" fill="#FCD9A0" />
              <rect x="315" y="36" width="6" height="14" rx="3" fill="#FCD9A0" />
            </g>
          </g>
        </svg>
        <span className="confetti-piece" style={{ left: '4%', animationDelay: '0.1s' }}>✨</span>
        <span className="confetti-piece" style={{ left: '20%', animationDelay: '0.45s' }}>🎉</span>
        <span className="confetti-piece" style={{ left: '38%', animationDelay: '0.2s' }}>⭐</span>
        <span className="confetti-piece" style={{ left: '64%', animationDelay: '0.5s' }}>✨</span>
        <span className="confetti-piece" style={{ left: '80%', animationDelay: '0.3s' }}>🎉</span>
        <span className="confetti-piece" style={{ left: '94%', animationDelay: '0.6s' }}>⭐</span>
      </div>
      <div className="end-badge">100%</div>
      <h1>Completato ♥</h1>
      <p className="end-message">
        Ti contatteremo presto per fissare il nostro <strong>incontro di ascolto</strong>.{' '}
        <strong>Grazie</strong> ancora per il tuo <strong>prezioso contributo</strong>!
      </p>
    </div>
  )
}
