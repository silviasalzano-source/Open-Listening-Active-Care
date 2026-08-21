'use client'

import { useEffect, useState } from 'react'
import { mascotBucket } from '../flow'
import { EnergyMascot } from '../mascots'
import type { Phase1Answers } from '../types'

const CAUSA_ICONS: Record<string, string> = {
  'Carico di lavoro': '🔋',
  'Relazioni con colleghi': '🤝',
  'Rapporto con il/la responsabile': '🎯',
  'Crescita e sviluppo professionale': '🌱',
  'Motivi personali/extra-lavorativi': '🏠',
  'Strumenti e organizzazione': '🛠️',
}

const BUCKET_PHRASES: Record<string, { pre: string; key: string; post: string }> = {
  low:    { pre: 'Oggi senti la batteria', key: 'piuttosto scarica', post: '' },
  lowmid: { pre: "In questo periodo l'energia", key: 'gira un po\' al minimo', post: '' },
  mid:    { pre: "In questo momento l'energia", key: 'procede a un ritmo regolare', post: '' },
  good:   { pre: "C'è una", key: 'bella carica', post: ' addosso in questo periodo' },
  high:   { pre: "L'energia è", key: 'alle stelle', post: ' in questo momento' },
}

const CLIMA_PHRASES: Record<string, string> = {
  Soleggiato: "l'aria che si respira intorno a te è leggera e distesa",
  'Parzialmente nuvoloso': 'qualche nuvola, di tanto in tanto, si fa sentire',
  Piovoso: "ci sono qualche nube di troppo all'orizzonte",
  Temporalesco: 'il clima intorno pesa più del solito',
}

const TREND_PHRASES: Record<string, string> = {
  'Energia in Crescita':      'la tua **energia** sta **crescendo**, passo dopo passo',
  'Energia Stabile':          'la tua **energia** si **mantiene** su un binario stabile',
  'Energia in Ricarica':      'la tua **energia** ha bisogno di una **pausa** per ricaricarsi',
  'Energia in Assestamento':  'la tua **energia** si sta **riequilibrando** su basi nuove',
}

const CONFETTI_PIECES = ['✨', '⭐', '✨', '⭐', '✨']

function BoldText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </>
  )
}

export function ResultScreen({
  answers,
  onContinue,
}: {
  answers: Phase1Answers
  onContinue: () => void
}) {
  const level = answers.termometro ?? 5
  const bucket = mascotBucket(level)
  const climaText = answers.clima ? CLIMA_PHRASES[answers.clima] : undefined
  const trendText = answers.descrizione ? TREND_PHRASES[answers.descrizione] : undefined
  const causa = answers.causa ?? []
  const causaAltro = answers.causa_altro

  const phrase = BUCKET_PHRASES[bucket]
  const isUplifting = bucket === 'good' || bucket === 'high'
  const isLow = bucket === 'low' || bucket === 'lowmid'

  const [revealed, setRevealed] = useState({ mascot: false, title: false, card: false, button: false })

  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealed((r) => ({ ...r, mascot: true })), 80),
      setTimeout(() => setRevealed((r) => ({ ...r, title: true })), 400),
      setTimeout(() => setRevealed((r) => ({ ...r, card: true })), 580),
      setTimeout(() => setRevealed((r) => ({ ...r, button: true })), 780),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="survey-screen result-screen">
      <div className="result-mascot-stage">
        {isLow && <div className="result-calm-glow" />}
        <div className={`result-reveal-mascot${revealed.mascot ? ' show' : ''}`}>
          <EnergyMascot level={level} idPrefix="result" />
        </div>
        {/* Badge livello energia */}
        {revealed.mascot && (
          <div className="result-level-badge">{level}<span>/10</span></div>
        )}
        {isUplifting &&
          CONFETTI_PIECES.map((piece, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{ left: `${8 + i * 20}%`, animationDelay: `${0.9 + i * 0.15}s` }}
            >
              {piece}
            </span>
          ))}
      </div>

      <h2 className={`result-reveal result-title-brand${revealed.title ? ' show' : ''}`}>
        My Energy Battery
      </h2>

      <div className={`result-card result-reveal${revealed.card ? ' show' : ''}`}>
        {/* Frase principale con parola chiave in grassetto */}
        <p>
          {phrase.pre} <strong>{phrase.key}</strong>{phrase.post}
          {climaText ? <> — {climaText}.</> : '.'}
        </p>

        {/* Trend annuale */}
        {trendText && (
          <p>Guardando ai mesi passati, <BoldText text={trendText} />.</p>
        )}


        {/* Cause come chip visivi */}
        {causa.length > 0 && (
          <div className="result-causa-section">
            <span className="result-causa-label">Cosa pesa di più oggi</span>
            <div className="result-causa-chips">
              {causa.map((c) => {
                const isAltro = c === 'Altro'
                const label = isAltro ? (causaAltro || 'Altro') : c
                const icon = CAUSA_ICONS[c] ?? '💬'
                return (
                  <span key={c} className="result-causa-chip">
                    {icon} {label}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <button
        className={`btn result-reveal${revealed.button ? ' show' : ''}`}
        disabled={!revealed.button}
        onClick={onContinue}
      >
        Prosegui
      </button>
    </div>
  )
}
