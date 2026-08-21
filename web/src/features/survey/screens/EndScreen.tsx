export function EndScreen() {
  return (
    <div className="survey-screen end">
      <div className="end-stage">
        <svg className="end-hr-duo" viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="160" rx="90" ry="8" fill="rgba(42,35,56,0.06)" />
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
          <g className="end-figure end-figure-b">
            <rect x="150" y="120" width="10" height="34" rx="3" fill="#2A2338" />
            <rect x="170" y="120" width="10" height="34" rx="3" fill="#2A2338" />
            <rect x="142" y="66" width="46" height="60" rx="16" fill="#17B8A6" />
            <rect x="154" y="86" width="22" height="14" rx="3" fill="#fff" />
            <text x="165" y="97" fontSize="9" fontWeight="700" textAnchor="middle" fill="#2A2338" fontFamily="Fredoka, sans-serif">HR</text>
            <circle cx="165" cy="46" r="20" fill="#FCD9A0" />
            <path d="M145,44 Q145,20 165,20 Q185,20 185,44 Q182,30 165,30 Q148,30 145,44Z" fill="#5B3A29" />
            <path d="M143,40 Q140,60 148,70" fill="none" stroke="#5B3A29" strokeWidth="8" strokeLinecap="round" />
            <path d="M187,40 Q190,60 182,70" fill="none" stroke="#5B3A29" strokeWidth="8" strokeLinecap="round" />
            <circle cx="158" cy="48" r="2.4" fill="#2A2338" /><circle cx="172" cy="48" r="2.4" fill="#2A2338" />
            <path d="M158,56 Q165,61 172,56" fill="none" stroke="#2A2338" strokeWidth="2.2" strokeLinecap="round" />
            <g className="end-thumb" style={{ animationDelay: '0.2s' }}>
              <path d="M186,78 Q202,70 206,52" fill="none" stroke="#17B8A6" strokeWidth="10" strokeLinecap="round" />
              <circle cx="207" cy="48" r="7" fill="#FCD9A0" />
              <rect x="203" y="36" width="6" height="14" rx="3" fill="#FCD9A0" />
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
      <h1>Completato!</h1>
    </div>
  )
}
