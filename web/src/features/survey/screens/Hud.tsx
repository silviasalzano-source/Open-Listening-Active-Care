export function Hud({ answered, total }: { answered: number; total: number }) {
  const pct = Math.round((answered / total) * 100)

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-brand-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element -- reuses the same static logo asset as IntroScreen */}
          <img src="/ot-logo.png" alt="" className="hud-logo" />
          <div className="brand">Open Listening</div>
        </div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
