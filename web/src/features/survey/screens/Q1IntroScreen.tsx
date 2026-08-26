'use client'

import { useEffect, useState } from 'react'
import { Q1IntroMascot } from '../mascots'

const CONTENT = {
  team: {
    badge: 'Focus: team',
    title: 'Ora ti chiediamo di concentrarti sul clima attuale del tuo team',
    desc: 'Pensa alle ultime settimane — le interazioni con i colleghi, l\'atmosfera, il ritmo di lavoro.',
  },
  anno: {
    badge: 'Focus: ultimo anno',
    title: 'Ora ti chiediamo di concentrarti sul tuo ultimo anno',
    desc: 'Guarda indietro agli ultimi 12 mesi — come è cambiata la tua energia nel tempo.',
  },
}

export function Q1IntroScreen({
  variant,
  onContinue,
  onBack,
}: {
  variant: 'team' | 'anno'
  onContinue: () => void
  onBack: () => void
}) {
  const content = CONTENT[variant]
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
  }, [variant])

  return (
    <div className="survey-screen q1intro">
      <div className={`chapter-reveal${revealed.mascot ? ' show' : ''}`}>
        <Q1IntroMascot variant={variant} />
      </div>
      <div className={`chapter-reveal q1intro-header${revealed.header ? ' show' : ''}`}>
        <span className="q1intro-badge">{content.badge}</span>
        <h2 className="q1intro-title-gradient">{content.title}</h2>
      </div>
      <div className={`chapter-reveal q1intro-desc-card${revealed.desc ? ' show' : ''}`}>
        <p>{content.desc}</p>
      </div>
      <div className={`chapter-reveal footer-nav${revealed.nav ? ' show' : ''}`}>
        <button className="btn ghost" onClick={onBack}>Indietro</button>
        <button className="btn" onClick={onContinue}>Continua</button>
      </div>
    </div>
  )
}
