import { Q1IntroMascot } from '../mascots'

export function Q1IntroScreen({
  variant,
  onContinue,
  onBack,
}: {
  variant: 'team' | 'anno'
  onContinue: () => void
  onBack: () => void
}) {
  const title =
    variant === 'team'
      ? 'Ora ti chiediamo di concentrarti sul clima attuale del tuo team'
      : 'Ora ti chiediamo di concentrarti sul tuo ultimo anno'

  return (
    <div className="survey-screen q1intro">
      <Q1IntroMascot variant={variant} />
      <h2>{title}</h2>
      <button className="btn" onClick={onContinue}>
        Continua
      </button>
      <button className="btn ghost" onClick={onBack}>
        Indietro
      </button>
    </div>
  )
}
