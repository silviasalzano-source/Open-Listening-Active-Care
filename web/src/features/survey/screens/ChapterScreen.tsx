import { ChapterMascot } from '../mascots'
import type { ChapterDef } from '../types'

type Props = {
  def: ChapterDef
  onBack: () => void
  onContinue: () => void
}

export function ChapterScreen({ def, onBack, onContinue }: Props) {
  return (
    <div className="survey-screen chapter">
      <ChapterMascot type={def.mascot} />
      <h2>{def.title}</h2>
      {def.desc && <p>{def.desc}</p>}
      <div className="footer-nav">
        <button className="btn ghost" onClick={onBack}>Indietro</button>
        <button className="btn cool" onClick={onContinue}>Continua</button>
      </div>
    </div>
  )
}
