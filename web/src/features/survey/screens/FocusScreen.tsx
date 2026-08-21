import { FocusMascot } from '../mascots'

export function FocusScreen({
  onContinue,
  onBack,
}: {
  onContinue: () => void
  onBack: () => void
}) {
  return (
    <div className="survey-screen q1intro">
      <FocusMascot />
      <h2>Ora ti chiediamo di rispondere tenendo il focus su di te.</h2>
      <button className="btn" onClick={onContinue}>
        Continua
      </button>
      <button className="btn ghost" onClick={onBack}>
        Indietro
      </button>
    </div>
  )
}
