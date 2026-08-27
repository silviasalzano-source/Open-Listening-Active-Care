'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'
import { createPortal } from 'react-dom'

type Props = { onConfirm: (nome: string, cognome: string) => void }

// ─── SVG Figures ─────────────────────────────────────────────────────────────

function FigBlonde({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 122" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="40" cy="119" rx="26" ry="4" fill="rgba(42,35,56,0.07)" />
      <rect x="26" y="88" width="8" height="28" rx="3" fill="#2A2338" />
      <rect x="42" y="88" width="8" height="28" rx="3" fill="#2A2338" />
      <rect x="14" y="44" width="48" height="50" rx="14" fill="#FF6E86" />
      <rect x="26" y="60" width="24" height="13" rx="3" fill="#fff" />
      <text x="38" y="71" fontSize="8" fontWeight="700" textAnchor="middle" fill="#2A2338" fontFamily="Fredoka, sans-serif">HR</text>
      <circle cx="38" cy="26" r="19" fill="#FCD9A0" />
      <path d="M19,22 Q19,1 38,1 Q57,1 57,22 Q55,9 38,9 Q21,9 19,22Z" fill="#F4C542" />
      <path d="M18,18 Q15,34 22,44" fill="none" stroke="#F4C542" strokeWidth="7" strokeLinecap="round" />
      <path d="M58,18 Q61,34 54,44" fill="none" stroke="#F4C542" strokeWidth="7" strokeLinecap="round" />
      <circle cx="32" cy="28" r="2.2" fill="#2A2338" />
      <circle cx="44" cy="28" r="2.2" fill="#2A2338" />
      <path d="M32,35 Q38,40 44,35" fill="none" stroke="#2A2338" strokeWidth="2" strokeLinecap="round" />
      {/* Wave arm with animation */}
      <g>
        <path d="M60,54 Q72,40 68,24" fill="none" stroke="#FF6E86" strokeWidth="9" strokeLinecap="round" />
        <circle cx="67" cy="20" r="6.5" fill="#FCD9A0" />
        <rect x="63" y="9" width="6" height="13" rx="3" fill="#FCD9A0" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 60 54; -22 60 54; 0 60 54; 14 60 54; 0 60 54"
          keyTimes="0; 0.25; 0.5; 0.75; 1"
          dur="1.4s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  )
}

function FigBrunette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 122" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="40" cy="119" rx="26" ry="4" fill="rgba(42,35,56,0.07)" />
      <rect x="26" y="88" width="8" height="28" rx="3" fill="#2A2338" />
      <rect x="42" y="88" width="8" height="28" rx="3" fill="#2A2338" />
      <rect x="14" y="44" width="48" height="50" rx="14" fill="#17B8A6" />
      <rect x="26" y="60" width="24" height="13" rx="3" fill="#fff" />
      <text x="38" y="71" fontSize="8" fontWeight="700" textAnchor="middle" fill="#2A2338" fontFamily="Fredoka, sans-serif">HR</text>
      <circle cx="38" cy="26" r="19" fill="#FCD9A0" />
      <path d="M19,22 Q19,1 38,1 Q57,1 57,22 Q55,9 38,9 Q21,9 19,22Z" fill="#5B3A29" />
      <path d="M18,18 Q15,34 22,44" fill="none" stroke="#5B3A29" strokeWidth="7" strokeLinecap="round" />
      <path d="M58,18 Q61,34 54,44" fill="none" stroke="#5B3A29" strokeWidth="7" strokeLinecap="round" />
      <circle cx="32" cy="28" r="2.2" fill="#2A2338" />
      <circle cx="44" cy="28" r="2.2" fill="#2A2338" />
      <path d="M32,35 Q38,40 44,35" fill="none" stroke="#2A2338" strokeWidth="2" strokeLinecap="round" />
      {/* Wave arm left with animation — delayed */}
      <g>
        <path d="M16,54 Q4,40 8,24" fill="none" stroke="#17B8A6" strokeWidth="9" strokeLinecap="round" />
        <circle cx="9" cy="20" r="6.5" fill="#FCD9A0" />
        <rect x="5" y="9" width="6" height="13" rx="3" fill="#FCD9A0" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 20 54; 22 20 54; 0 20 54; -14 20 54; 0 20 54"
          keyTimes="0; 0.25; 0.5; 0.75; 1"
          dur="1.4s"
          begin="0.2s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  )
}

function FigMan({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 122" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="40" cy="119" rx="26" ry="4" fill="rgba(42,35,56,0.07)" />
      <rect x="26" y="88" width="8" height="28" rx="3" fill="#2A2338" />
      <rect x="42" y="88" width="8" height="28" rx="3" fill="#2A2338" />
      <rect x="14" y="44" width="48" height="50" rx="14" fill="#9575CD" />
      <rect x="26" y="60" width="24" height="13" rx="3" fill="#fff" />
      <text x="38" y="71" fontSize="8" fontWeight="700" textAnchor="middle" fill="#2A2338" fontFamily="Fredoka, sans-serif">HR</text>
      <circle cx="38" cy="26" r="19" fill="#FCD9A0" />
      <rect x="21" y="11" width="34" height="11" rx="2" fill="#9E9E9E" />
      <line x1="27" y1="11" x2="27" y2="4" stroke="#9E9E9E" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="33" y1="11" x2="33" y2="3" stroke="#9E9E9E" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="38" y1="11" x2="38" y2="3" stroke="#9E9E9E" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="43" y1="11" x2="43" y2="3" stroke="#9E9E9E" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="49" y1="11" x2="49" y2="4" stroke="#9E9E9E" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="18" y="17" width="5" height="11" rx="2" fill="#9E9E9E" />
      <rect x="57" y="17" width="5" height="11" rx="2" fill="#9E9E9E" />
      <circle cx="32" cy="28" r="2.2" fill="#2A2338" />
      <circle cx="44" cy="28" r="2.2" fill="#2A2338" />
      <path d="M32,35 Q38,40 44,35" fill="none" stroke="#2A2338" strokeWidth="2" strokeLinecap="round" />
      {/* Pointing arm — extends right toward fields */}
      <g>
        <path d="M62,64 Q80,60 84,68" fill="none" stroke="#9575CD" strokeWidth="9" strokeLinecap="round" />
        <circle cx="86" cy="70" r="6" fill="#FCD9A0" />
        <rect x="83" y="63" width="5" height="10" rx="2.5" fill="#FCD9A0" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 62 64; -10 62 64; 0 62 64; 6 62 64; 0 62 64"
          keyTimes="0; 0.3; 0.5; 0.75; 1"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  )
}

// ─── Step 1: Info + consent ───────────────────────────────────────────────────

function Step1({ onNext }: { onNext: () => void }) {
  const [agreed, setAgreed] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setScrolled(true)
  }

  return (
    <div className="ob-step1">
      {/* Header */}
      <div className="ob-step1-header">
        <h2 className="ob-title">Benvenuto/a</h2>
        <div className="ob-figs-duo">
          <div className="ob-fig-pair">
            <FigBlonde className="ob-fig-svg" />
            <div className="ob-bubble ob-bubble-r">Siamo qui<br />per ascoltarti!</div>
          </div>
          <div className="ob-fig-pair ob-fig-pair-rev">
            <div className="ob-bubble ob-bubble-l">Ci vuole solo<br />qualche minuto</div>
            <FigBrunette className="ob-fig-svg" />
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="ob-scroll" ref={scrollRef} onScroll={handleScroll}>

        <div className="ob-section">
          <div className="ob-dot ob-dot-amber" />
          <div>
            <div className="ob-section-title">My Energy Battery <span className="ob-section-tag ob-tag-warm">~ 5 min · Nominativa</span></div>
            <p className="ob-section-body">Come stai oggi e nell'ultimo anno. Le risposte sono associate al tuo nome per organizzare il tuo <strong>momento di ascolto personale</strong> con HR.</p>
          </div>
        </div>

        <div className="ob-section">
          <div className="ob-dot ob-dot-teal" />
          <div>
            <div className="ob-section-title">Fattori Energy Battery <span className="ob-section-tag ob-tag-cool">~ 10 min · Anonima</span></div>
            <p className="ob-section-body">22 domande su 7 aree del lavoro. <strong>Completamente anonima</strong>: nessuno saprà mai chi ha risposto cosa.</p>
          </div>
        </div>

        <div className="ob-section">
          <div className="ob-dot ob-dot-coral" />
          <div>
            <div className="ob-section-title">Privacy</div>
            <p className="ob-section-body">I dati vengono analizzati solo in forma aggregata. I manager non hanno accesso alle risposte individuali.</p>
          </div>
        </div>

        <div className="ob-section ob-section-last">
          <div className="ob-dot ob-dot-magenta" />
          <div>
            <div className="ob-section-title">Durata totale</div>
            <p className="ob-section-body">Circa <strong>15 minuti</strong>. Compilala in un momento di pausa, senza fretta.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="ob-footer">
        {!scrolled && (
          <p className="ob-scroll-hint">↓ Scorri per leggere tutto</p>
        )}
        <label className={`ob-check-row${!scrolled ? ' ob-check-dim' : ''}`}>
          <input
            type="checkbox"
            className="ob-checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            disabled={!scrolled}
          />
          <span>Ho letto e capito come funziona questa survey</span>
        </label>
        <button className="btn ob-btn-next" onClick={onNext} disabled={!agreed}>
          Avanti
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Name input ───────────────────────────────────────────────────────

function Step2({ onNext }: { onNext: (nome: string, cognome: string) => void }) {
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (nome.trim() && cognome.trim()) onNext(nome.trim(), cognome.trim())
  }

  const valid = nome.trim().length > 0 && cognome.trim().length > 0

  return (
    <div className="ob-step2">
      <div className="ob-step2-top">
        <h2 className="ob-name-title">Come ti chiami?</h2>
      </div>

      <div className="ob-step2-fig-area">
        <FigMan className="ob-fig-man" />
        <div className="ob-speech-bubble">
          Questa info è riservata solo a noi HR, ci aiuterà per il tuo momento di ascolto one to one.
        </div>
      </div>

      <form className="ob-name-form" onSubmit={handleSubmit}>
        <div className="ob-field">
          <label className="ob-field-label">Nome</label>
          <input className="ob-input" type="text" placeholder="Il tuo nome" value={nome} onChange={e => setNome(e.target.value)} required autoFocus />
        </div>
        <div className="ob-field">
          <label className="ob-field-label">Cognome</label>
          <input className="ob-input" type="text" placeholder="Il tuo cognome" value={cognome} onChange={e => setCognome(e.target.value)} required />
        </div>
        <button className="btn ob-btn-start" type="submit" disabled={!valid}>
          Incominciamo!
        </button>
      </form>
    </div>
  )
}

// ─── Step 3: Countdown ────────────────────────────────────────────────────────

const COUNT_STEPS = ['3', '2', '1', 'Viaaaaa!']

function Step3({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (idx >= COUNT_STEPS.length - 1) {
      const t = setTimeout(onDone, 900)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setIdx(i => i + 1)
      setAnimKey(k => k + 1)
    }, 750)
    return () => clearTimeout(t)
  }, [idx, onDone])

  const isFinal = idx === COUNT_STEPS.length - 1

  return (
    <div className="ob-countdown-wrap">
      <div className="ob-battery-anim">
        <div className="ob-battery-fill" style={{ width: `${((idx + 1) / COUNT_STEPS.length) * 100}%` }} />
      </div>
      <div key={animKey} className={`ob-count-num${isFinal ? ' ob-count-final' : ''}`}>
        {COUNT_STEPS[idx]}
      </div>
    </div>
  )
}

// ─── Modal shell ─────────────────────────────────────────────────────────────

function OnboardingContent({ onConfirm }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')

  if (step === 3) {
    return (
      <div className="ob-overlay ob-overlay-dark">
        <Step3 onDone={() => onConfirm(nome, cognome)} />
      </div>
    )
  }

  return (
    <div className="ob-overlay">
      <div className="ob-card">
        {step === 1 && <Step1 onNext={() => setStep(2)} />}
        {step === 2 && <Step2 onNext={(n, c) => { setNome(n); setCognome(c); setStep(3) }} />}
      </div>
    </div>
  )
}

export function OnboardingModal({ onConfirm }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return createPortal(<OnboardingContent onConfirm={onConfirm} />, document.body)
}
