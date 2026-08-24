export function TransitionScreen({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  return (
    <div className="survey-screen transition">
      <div className="lock-wrap">🔒</div>
      <h2>Da ora in poi, in totale anonimato</h2>
      <div className="transition-body">
        <p>
          Le prossime domande <strong>non sono collegate al tuo profilo</strong>: nessuno
          in azienda potrà risalire a chi ha risposto cosa.
        </p>
        <p>
          Rispondi con la <strong>massima libertà</strong> — è l&apos;unico modo per darci
          un quadro reale di come stanno le persone in OT.
        </p>
      </div>
      <svg className="network-svg" width="220" height="30" viewBox="0 0 220 30">
        <path d="M0 15 L220 15" stroke="#17B8A6" strokeWidth={2} fill="none" opacity={0.8} />
      </svg>
      <button className="btn cool" onClick={onContinue}>
        Continua in anonimato →
      </button>
      <button className="btn ghost" onClick={onBack} style={{ marginTop: 8 }}>
        Indietro
      </button>
      <div className="microcopy">
        I dati verranno analizzati solo in forma aggregata, mai persona per persona.
      </div>
    </div>
  )
}
