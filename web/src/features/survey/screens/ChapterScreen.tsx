'use client'

import { useEffect, useState } from 'react'
import { ChapterMascot } from '../mascots'
import type { ChapterDef } from '../types'

type Props = {
  def: ChapterDef
  chapterIndex: number
  chapterTotal: number
  onBack: () => void
  onContinue: () => void
}

export function ChapterScreen({ def, chapterIndex, chapterTotal, onBack, onContinue }: Props) {
  const [revealed, setRevealed] = useState({ mascot: false, header: false, desc: false, nav: false })

  useEffect(() => {
    setRevealed({ mascot: false, header: false, desc: false, nav: false })
    const timers = [
      setTimeout(() => setRevealed(r => ({ ...r, mascot: true })), 60),
      setTimeout(() => setRevealed(r => ({ ...r, header: true })), 280),
      setTimeout(() => setRevealed(r => ({ ...r, desc: true })), 440),
      setTimeout(() => setRevealed(r => ({ ...r, nav: true })), 580),
    ]
    return () => timers.forEach(clearTimeout)
  }, [def])

  return (
    <div className="survey-screen chapter">
      <div className={`chapter-reveal${revealed.mascot ? ' show' : ''}`}>
        <ChapterMascot type={def.mascot} />
      </div>
      <div className={`chapter-reveal chapter-header${revealed.header ? ' show' : ''}`}>
        <span className="chapter-badge">Sezione {chapterIndex} di {chapterTotal}</span>
        <h2 className="chapter-title-gradient">{def.title}</h2>
      </div>
      {def.desc && (
        <div className={`chapter-reveal chapter-desc-card${revealed.desc ? ' show' : ''}`}>
          <p>{def.desc}</p>
        </div>
      )}
      <div className={`chapter-reveal footer-nav${revealed.nav ? ' show' : ''}`}>
        <button className="btn ghost" onClick={onBack}>Indietro</button>
        <button className="btn cool" onClick={onContinue}>Continua</button>
      </div>
    </div>
  )
}
