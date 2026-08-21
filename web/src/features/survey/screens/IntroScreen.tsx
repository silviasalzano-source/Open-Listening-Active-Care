export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="survey-screen intro">
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed static asset, no next/image sizing needed */}
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
    </div>
  )
}
