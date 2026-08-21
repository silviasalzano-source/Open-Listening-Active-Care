export function TransitionScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="survey-screen transition">
      <div className="lock-wrap">🔒</div>
      <h2>Da qui in poi, in totale anonimato</h2>
      <p>
        Le prossime domande non sono collegate al tuo profilo: nessuno in azienda potrà
        risalire a chi ha risposto cosa.
        <br />
        <br />
        Rispondi con la massima libertà: è l&apos;unico modo per darci un quadro di come
        stanno le persone in OT.
      </p>
      <svg className="network-svg" width="220" height="30" viewBox="0 0 220 30">
        <path d="M0 15 L220 15" stroke="#17B8A6" strokeWidth={2} fill="none" opacity={0.8} />
      </svg>
      <button className="btn cool" onClick={onContinue}>
        Continua in anonimato →
      </button>
      <div className="microcopy">
        I dati verranno analizzati solo in forma aggregata, mai persona per persona.
      </div>
    </div>
  )
}
