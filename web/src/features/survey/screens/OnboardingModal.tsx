'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { createPortal } from 'react-dom'

type Props = { onConfirm: (nome: string, cognome: string) => void; onClose: () => void }

// ─── Info card SVG icons (CausaSvg-style animated icons) ─────────────────────

function ChipGrowthSvg() {
  return (
    <svg viewBox="0 0 44 44" width="22" height="22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="7" y1="36" x2="37" y2="36" stroke="rgba(42,35,56,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="9" y="24" width="8" height="12" rx="3" fill="#FFB648">
        <animate attributeName="y" values="30;24;30" dur="2.2s" begin="0s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="height" values="6;12;6" dur="2.2s" begin="0s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
      <rect x="19" y="18" width="8" height="18" rx="3" fill="#FF9052">
        <animate attributeName="y" values="28;18;28" dur="2.2s" begin="0.3s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="height" values="8;18;8" dur="2.2s" begin="0.3s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
      <rect x="29" y="12" width="8" height="24" rx="3" fill="#FF6E86">
        <animate attributeName="y" values="24;12;24" dur="2.2s" begin="0.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="height" values="12;24;12" dur="2.2s" begin="0.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
    </svg>
  )
}

function ChipWorkloadSvg() {
  return (
    <svg viewBox="0 0 44 44" width="22" height="22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="28" width="32" height="12" rx="3" fill="#F0DFC0" stroke="#C9862B" strokeWidth="1.5"/>
      <rect x="7" y="22" width="30" height="12" rx="3" fill="#F8EDD4" stroke="#C9862B" strokeWidth="1.5"/>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="1.8s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <rect x="8" y="14" width="28" height="12" rx="3" fill="#FFB648" stroke="#C9862B" strokeWidth="1.5"/>
        <line x1="12" y1="19" x2="32" y2="19" stroke="rgba(42,35,56,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="12" y1="22.5" x2="26" y2="22.5" stroke="rgba(42,35,56,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  )
}

function CardGrowthSvg() {
  return (
    <svg viewBox="0 0 44 44" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="7" y1="36" x2="37" y2="36" stroke="rgba(42,35,56,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="9" y="24" width="8" height="12" rx="3" fill="#FFB648">
        <animate attributeName="y" values="30;24;30" dur="2.2s" begin="0.1s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="height" values="6;12;6" dur="2.2s" begin="0.1s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
      <rect x="19" y="18" width="8" height="18" rx="3" fill="#FF9052">
        <animate attributeName="y" values="28;18;28" dur="2.2s" begin="0.4s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="height" values="8;18;8" dur="2.2s" begin="0.4s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
      <rect x="29" y="12" width="8" height="24" rx="3" fill="#FF6E86">
        <animate attributeName="y" values="24;12;24" dur="2.2s" begin="0.7s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <animate attributeName="height" values="12;24;12" dur="2.2s" begin="0.7s" repeatCount="indefinite" calcMode="ease-in-out"/>
      </rect>
    </svg>
  )
}

function CardRelationsSvg() {
  return (
    <svg viewBox="0 0 44 44" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="1.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <circle cx="13" cy="17" r="9" fill="#17B8A6"/>
        <circle cx="11" cy="15" r="3" fill="#fff" opacity="0.4"/>
        <circle cx="11" cy="18" r="1.8" fill="#2A2338"/>
        <circle cx="15" cy="18" r="1.8" fill="#2A2338"/>
        <path d="M10,23 Q13,25.5 16,23" fill="none" stroke="#2A2338" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="5" y="26" width="16" height="12" rx="5" fill="#17B8A6"/>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;-2,0;0,0" dur="1.6s" repeatCount="indefinite" calcMode="ease-in-out"/>
        <circle cx="31" cy="17" r="9" fill="#4DD9CC"/>
        <circle cx="29" cy="15" r="3" fill="#fff" opacity="0.4"/>
        <circle cx="29" cy="18" r="1.8" fill="#2A2338"/>
        <circle cx="33" cy="18" r="1.8" fill="#2A2338"/>
        <path d="M28,23 Q31,25.5 34,23" fill="none" stroke="#2A2338" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="23" y="26" width="16" height="12" rx="5" fill="#4DD9CC"/>
      </g>
    </svg>
  )
}

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
      <defs>
        <linearGradient id="figManBody" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#CEAFF2" />
          <stop offset="45%" stopColor="#9E76D8" />
          <stop offset="100%" stopColor="#7248BB" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="119" rx="26" ry="4" fill="rgba(42,35,56,0.07)" />
      <rect x="26" y="88" width="8" height="28" rx="3" fill="#7248BB" />
      <rect x="42" y="88" width="8" height="28" rx="3" fill="#7248BB" />
      <rect x="14" y="44" width="48" height="50" rx="14" fill="url(#figManBody)" />
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
        <path d="M62,64 Q80,60 84,68" fill="none" stroke="#9265C8" strokeWidth="9" strokeLinecap="round" />
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

function Step1({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="ob-step1">
      {/* Header */}
      <div className="ob-step1-header">
        <h2 className="ob-title">Benvenuto/a</h2>
        <div className="ob-figs-duo">
          <div className="ob-fig-col">
            <div className="ob-chip" style={{ borderColor: '#FF6E86' }}>
              <ChipGrowthSvg />
              2 Survey
            </div>
            <FigBlonde className="ob-fig-svg" />
          </div>
          <div className="ob-fig-col">
            <div className="ob-chip" style={{ borderColor: '#17B8A6' }}>
              <ChipWorkloadSvg />
              10 minuti
            </div>
            <FigBrunette className="ob-fig-svg" />
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="ob-scroll">

        <div className="ob-section-card ob-card-warm">
          <div className="ob-card-icon ob-card-icon-warm">
            <CardGrowthSvg />
          </div>
          <div>
            <div className="ob-section-title">My Energy Battery <span className="ob-section-tag ob-tag-warm">Survey nominativa</span></div>
            <p className="ob-section-body">Vogliamo conoscere il tuo <strong>livello di energia</strong> in OT e quello del tuo team.</p>
            <p className="ob-section-body ob-section-body-sub">I dati sono <strong>associati al tuo nome e cognome</strong>, utili per il momento one to one con HR.</p>
          </div>
        </div>

        <div className="ob-section-card ob-card-cool">
          <div className="ob-card-icon ob-card-icon-cool">
            <CardRelationsSvg />
          </div>
          <div>
            <div className="ob-section-title">Fattori Energy Battery <span className="ob-section-tag ob-tag-cool">Survey anonima</span></div>
            <p className="ob-section-body">Desideriamo sapere quali sono le <strong>variabili che influenzano la tua carica</strong> di energia.</p>
            <p className="ob-section-body ob-section-body-sub">I dati vengono raccolti in modo <strong>completamente anonimo</strong> e analizzati solo in forma aggregata.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="ob-footer">
        <label className="ob-check-row">
          <input
            type="checkbox"
            className="ob-checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
          />
          <span>Ho letto e capito come funziona questa survey</span>
        </label>
        <button className="btn ob-btn-next" onClick={onNext} disabled={!agreed}>
          Avanti
        </button>
        <button className="btn ghost ob-btn-back" onClick={onBack}>
          Indietro
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Name input ───────────────────────────────────────────────────────

function Step2({ onNext, onBack }: { onNext: (nome: string, cognome: string) => void; onBack: () => void }) {
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
          Esclusivamente HR avrà accesso a queste informazioni. I manager avranno solo una panoramica generale con dati aggregati delle BU e team.
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
        <button className="btn ghost ob-btn-back" type="button" onClick={onBack}>
          Indietro
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

function OnboardingContent({ onConfirm, onClose }: Props) {
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
        {step === 1 && <Step1 onNext={() => setStep(2)} onBack={onClose} />}
        {step === 2 && <Step2 onNext={(n, c) => { setNome(n); setCognome(c); setStep(3) }} onBack={() => setStep(1)} />}
      </div>
    </div>
  )
}

export function OnboardingModal({ onConfirm, onClose }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return createPortal(<OnboardingContent onConfirm={onConfirm} onClose={onClose} />, document.body)
}
