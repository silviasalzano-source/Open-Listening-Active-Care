'use client'

import { useEffect, useState } from 'react'
import { mascotBucket } from '../flow'
import { EnergyMascot } from '../mascots'
import type { Phase1Answers } from '../types'

const BUCKET_PHRASES: Record<string, string> = {
  low: 'Oggi senti la batteria piuttosto scarica',
  lowmid: "In questo periodo l'energia gira un po' al minimo",
  mid: "In questo momento l'energia procede a un ritmo regolare",
  good: "C'è una bella carica addosso in questo periodo",
  high: "L'energia è alle stelle in questo momento",
}

const CLIMA_PHRASES: Record<string, string> = {
  Soleggiato: "e l'aria che si respira intorno a te è leggera e distesa",
  'Parzialmente nuvoloso': 'anche se qualche nuvola, di tanto in tanto, si fa sentire',
  Piovoso: "con qualche nube di troppo all'orizzonte",
  Temporalesco: 'e il clima intorno pesa più del solito',
}

const TREND_PHRASES: Record<string, string> = {
  'Energia in Crescita': 'la stai facendo crescere, passo dopo passo',
  'Energia Stabile': 'la stai mantenendo su un binario stabile',
  'Energia in Ricarica': 'senti che ha bisogno di una pausa per ricaricarsi',
  'Energia in Assestamento': 'la stai riequilibrando su basi nuove',
}

const CONFETTI_PIECES = ['✨', '⭐', '✨', '⭐', '✨']

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

  const mainSentence = `${BUCKET_PHRASES[bucket]}${climaText ? `, ${climaText}` : ''}.`
  const secondSentence = trendText ? `Guardando ai mesi passati, ${trendText}.` : null
  const causaSentence = causa.length
    ? `Il peso maggiore, oggi, lo porta ${causa[0].toLowerCase()}${
        causa[1] ? `, insieme a ${causa[1].toLowerCase()}` : ''
      }.`
    : null

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
        <p>{mainSentence}</p>
        {secondSentence && <p>{secondSentence}</p>}
        {causaSentence && <p>{causaSentence}</p>}
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
