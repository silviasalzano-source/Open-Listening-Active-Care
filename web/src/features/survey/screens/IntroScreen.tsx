export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="survey-screen intro">
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed static asset, no next/image sizing needed */}
      <img src="/ot-logo-full.svg" alt="OT Consulting" className="intro-logo" />
      <div className="intro-badge">Open Listening · Active Care</div>
      <div className="battery-hero">
        <div className="battery-hero-fill" />
      </div>
      <h1>
        Quanta <span>energia</span>
        <br />
        hai oggi in OT?
      </h1>
      <p>
        Prima di organizzare il nostro momento di ascolto, desideriamo conoscere la tua{' '}
        <span>energia professionale</span> per affrontare al meglio quest&apos;anno!
      </p>
      <button className="btn" onClick={onStart}>
        Iniziamo
      </button>
      <a href="/admin" className="intro-db-btn" title="Accesso Dashboard HR">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="18" width="5" height="10" rx="2" fill="#FFB648"/>
          <rect x="10" y="12" width="5" height="16" rx="2" fill="#FF6E86"/>
          <rect x="17" y="7" width="5" height="21" rx="2" fill="#17B8A6"/>
          <rect x="24" y="14" width="5" height="14" rx="2" fill="#2E86DE"/>
        </svg>
        <span className="intro-db-label">HR</span>
      </a>
    </div>
  )
}
