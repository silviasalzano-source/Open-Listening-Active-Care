'use client'

import type { Phase2Question, ChapterDef, SurveyAnswers, MascotType } from '../types'

const CHAPTER_COLORS: Record<MascotType, { bg: string; text: string }> = {
  commute:  { bg: '#FF6E86', text: '#fff' },
  talk:     { bg: '#FF6E86', text: '#fff' },
  growth:   { bg: '#FFB648', text: '#fff' },
  tech:     { bg: '#C96CC9', text: '#fff' },
  flow:     { bg: '#17B8A6', text: '#fff' },
  timeline: { bg: '#78C7FF', text: '#2A2338' },
  finish:   { bg: '#FF6E86', text: '#fff' },
}

type Props = {
  def: ChapterDef
  questions: Phase2Question[]
  answers: SurveyAnswers
  onAnswer: (id: string, value: string | string[] | number | undefined) => void
  onBack: () => void
  onNext: () => void
}

function isAnswered(q: Phase2Question, answers: SurveyAnswers): boolean {
  if (q.type === 'likert5' && q.optional) return true
  if (q.type === 'multi') {
    const arr = answers[q.id] as string[] | undefined
    if (!arr || !arr.length) return false
    if (q.hasInputOn && arr.includes(q.hasInputOn)) {
      const altroVal = (answers[q.id + '_altro'] as string | undefined) ?? ''
      if (!altroVal.trim()) return false
    }
    return true
  }
  return answers[q.id] !== undefined
}

// ── Single question widget ──────────────────────────────────────────────────

function SingleWidget({ q, answers, onAnswer }: {
  q: Extract<Phase2Question, { type: 'single' }>
  answers: SurveyAnswers
  onAnswer: (id: string, value: string) => void
}) {
  const selected = answers[q.id] as string | undefined
  return (
    <div className="options compact">
      {q.options.map((opt) => (
        <button
          key={opt}
          className={`opt-card compact${selected === opt ? ' selected' : ''}`}
          onClick={() => onAnswer(q.id, opt)}
        >
          <div className="opt-text" style={{ flex: 1 }}><b>{opt}</b></div>
          <div className="opt-check" />
        </button>
      ))}
    </div>
  )
}

// ── Likert5 widget ──────────────────────────────────────────────────────────

function Likert5Widget({ q, answers, onAnswer }: {
  q: Extract<Phase2Question, { type: 'likert5' }>
  answers: SurveyAnswers
  onAnswer: (id: string, value: number) => void
}) {
  const selected = answers[q.id] as number | undefined
  const labels = q.scaleLabels ?? ['Completamente in disaccordo', 'Completamente in accordo']
  return (
    <>
      <div className="likert">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            className={`likert-btn${selected === i ? ' selected' : ''}`}
            onClick={() => onAnswer(q.id, i)}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="likert-labels">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </>
  )
}

// ── Multi question widget ───────────────────────────────────────────────────

function MultiWidget({ q, answers, onAnswer }: {
  q: Extract<Phase2Question, { type: 'multi' }>
  answers: SurveyAnswers
  onAnswer: (id: string, value: string | string[] | number | undefined) => void
}) {
  const selected: string[] = (answers[q.id] as string[] | undefined) ?? []
  const altroText = (answers[q.id + '_altro'] as string | undefined) ?? ''
  const altroActive = q.hasInputOn ? selected.includes(q.hasInputOn) : false

  function toggle(opt: string) {
    if (selected.includes(opt)) {
      const next = selected.filter((o) => o !== opt)
      onAnswer(q.id, next.length ? next : undefined)
    } else {
      if (selected.length >= q.max) return
      onAnswer(q.id, [...selected, opt])
    }
  }

  return (
    <>
      <div className="options compact">
        {q.options.map((opt) => (
          <button
            key={opt}
            className={`opt-card compact${selected.includes(opt) ? ' selected' : ''}`}
            onClick={() => toggle(opt)}
          >
            <div className="opt-text" style={{ flex: 1 }}><b>{opt}</b></div>
            <div className="opt-check" />
          </button>
        ))}
      </div>
      {altroActive && (
        <>
          {!altroText.trim() && <div className="altro-hint">✏️ Scrivi qualcosa per continuare</div>}
          <input
            className="altro-input"
            placeholder="Scrivi qui la tua risposta…"
            value={altroText}
            onChange={(e) => onAnswer(q.id + '_altro', e.target.value)}
          />
        </>
      )}
    </>
  )
}

// ── NPS widget ──────────────────────────────────────────────────────────────

function NpsWidget({ q, answers, onAnswer }: {
  q: Extract<Phase2Question, { type: 'nps' }>
  answers: SurveyAnswers
  onAnswer: (id: string, value: number) => void
}) {
  const selected = answers[q.id] as number | undefined
  return (
    <>
      <div className="nps-grid">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            className={`nps-btn${selected === i ? ' selected' : ''}`}
            onClick={() => onAnswer(q.id, i)}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="scale-labels">
        <span>Per niente probabile</span>
        <span>Estremamente probabile</span>
      </div>
    </>
  )
}

// ── Question block ──────────────────────────────────────────────────────────

function QuestionBlock({ q, answers, onAnswer }: {
  q: Phase2Question
  answers: SurveyAnswers
  onAnswer: (id: string, value: string | string[] | number | undefined) => void
}) {
  return (
    <div className="cs-block">
      {q.type === 'likert5' && q.alert && (
        <div className="cs-alert">⚠️ {q.alert}</div>
      )}
      <div className="cs-title">{q.title}</div>
      {q.sub && <div className="cs-sub">{q.sub}</div>}
      <div className="cs-widget">
        {q.type === 'single' && (
          <SingleWidget q={q} answers={answers} onAnswer={onAnswer} />
        )}
        {q.type === 'likert5' && (
          <Likert5Widget q={q} answers={answers} onAnswer={onAnswer} />
        )}
        {q.type === 'multi' && (
          <MultiWidget q={q} answers={answers} onAnswer={onAnswer} />
        )}
        {q.type === 'nps' && (
          <NpsWidget q={q} answers={answers} onAnswer={onAnswer} />
        )}
      </div>
    </div>
  )
}

// ── Chapter set screen ──────────────────────────────────────────────────────

export function ChapterSetScreen({ def, questions, answers, onAnswer, onBack, onNext }: Props) {
  const allAnswered = questions.every((q) => isAnswered(q, answers))

  return (
    <div className="survey-screen chapterset">
      <div
        className="q-eyebrow cs-chapter-eyebrow"
        style={{ background: CHAPTER_COLORS[def.mascot].bg, color: CHAPTER_COLORS[def.mascot].text }}
      >{def.title}</div>
      {questions.map((q, i) => {
        const showGroup = q.group && q.group !== questions[i - 1]?.group
        return (
          <div key={q.id}>
            {showGroup && (
              <div
                className="cs-group-label"
                style={{ background: CHAPTER_COLORS[def.mascot].bg, color: CHAPTER_COLORS[def.mascot].text }}
              >{q.group}</div>
            )}
            <QuestionBlock q={q} answers={answers} onAnswer={onAnswer} />
          </div>
        )
      })}
      <div className="footer-nav">
        <button className="btn ghost" onClick={onBack}>Indietro</button>
        <button className="btn cool" onClick={onNext} disabled={!allAnswered}>Continua</button>
      </div>
    </div>
  )
}
