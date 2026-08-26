'use client'

import { useEffect, useState } from 'react'
import { FocusMascot } from '../mascots'

export function FocusScreen({
  onContinue,
  onBack,
}: {
  onContinue: () => void
  onBack: () => void
}) {
  const [revealed, setRevealed] = useState({ mascot: false, header: false, desc: false, nav: false })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRevealed({ mascot: false, header: false, desc: false, nav: false })
    const timers = [
      setTimeout(() => setRevealed(r => ({ ...r, mascot: true })), 60),
      setTimeout(() => setRevealed(r => ({ ...r, header: true })), 280),
      setTimeout(() => setRevealed(r => ({ ...r, desc: true })), 440),
      setTimeout(() => setRevealed(r => ({ ...r, nav: true })), 580),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="survey-screen q1intro">
      <div className={`chapter-reveal${revealed.mascot ? ' show' : ''}`}>
        <FocusMascot />
      </div>
      <div className={`chapter-reveal q1intro-header${revealed.header ? ' show' : ''}`}>
        <span className="q1intro-badge">My Energy Battery</span>
        <h2 className="q1intro-title-gradient">Ora ti chiediamo di rispondere tenendo il focus su di te.</h2>
      </div>
      <div className={`chapter-reveal q1intro-desc-card${revealed.desc ? ' show' : ''}`}>
        <p>Non pensare al team o ai colleghi — solo a come ti senti tu, in prima persona.</p>
      </div>
      <div className={`chapter-reveal footer-nav${revealed.nav ? ' show' : ''}`}>
        <button className="btn ghost" onClick={onBack}>Indietro</button>
        <button className="btn" onClick={onContinue}>Continua</button>
      </div>
    </div>
  )
}
