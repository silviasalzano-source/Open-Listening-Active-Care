'use client'

import type { Phase2Question, ChapterDef, SurveyAnswers, MascotType } from '../types'

const CHAPTER_COLORS: Record<MascotType, { bg: string; text: string }> = {
  commute:  { bg: '#17B8A6', text: '#fff' },
  talk:     { bg: '#17B8A6', text: '#fff' },
  growth:   { bg: '#17B8A6', text: '#fff' },
  tech:     { bg: '#17B8A6', text: '#fff' },
  flow:     { bg: '#17B8A6', text: '#fff' },
  timeline: { bg: '#17B8A6', text: '#fff' },
  finish:   { bg: '#17B8A6', text: '#fff' },
}

function stripEmoji(s: string): string {
  return s.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}️⃣]+\s*/gu, '').trim()
}

const GROUP_SVG: Record<string, string> = {
  'I colleghi': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="6" r="2.5" stroke="white" stroke-width="1.5"/><path d="M2 17c0-3 2-5 5-5s5 2 5 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="6" r="2.5" stroke="white" stroke-width="1.5"/><path d="M12 17c0-2 1-3.5 2.5-4" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'Responsabile': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="6" r="3" stroke="white" stroke-width="1.5"/><path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" stroke-width="1.5" stroke-linecap="round"/><path d="M13 3l.5 1.1 1.2.1-.9.8.3 1.2-1.1-.6-1.1.6.3-1.2-.9-.8 1.2-.1z" fill="white"/></svg>`,
  'HR': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8.5" y="3" width="3" height="14" rx="1.5" fill="white"/><rect x="3" y="8.5" width="14" height="3" rx="1.5" fill="white"/></svg>`,
  'Management': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 18h14" stroke="white" stroke-width="1.5" stroke-linecap="round"/><rect x="5" y="8" width="10" height="10" rx="1" stroke="white" stroke-width="1.5"/><path d="M5 8L10 4l5 4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="8" y="12" width="4" height="6" fill="white" rx="0.5"/><rect x="6.5" y="10" width="2" height="2" rx="0.3" fill="white"/><rect x="11.5" y="10" width="2" height="2" rx="0.3" fill="white"/></svg>`,
  'Autonomia nel lavoro': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="3" stroke="white" stroke-width="1.5"/><path d="M10 3.5v2M10 14.5v2M3.5 10h2M14.5 10h2M5.6 5.6l1.4 1.4M13 13l1.4 1.4M14.4 5.6l-1.4 1.4M7 13l-1.4 1.4" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'Crescita professionale': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 16L10 10l4 4 5-7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7h3v3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  'Valori aziendali': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3a5 5 0 0 1 3.5 8.5l-.5.5V14H7v-2l-.5-.5A5 5 0 0 1 10 3z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><path d="M7.5 17h5" stroke="white" stroke-width="1.5" stroke-linecap="round"/><path d="M8.5 14v2.5M11.5 14v2.5" stroke="white" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  'Tecnologia': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="14" height="9" rx="1.5" stroke="white" stroke-width="1.5"/><path d="M7 17h6M10 14v3" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'Carico di lavoro': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="14" height="6" rx="1.5" stroke="white" stroke-width="1.5"/><path d="M17 9.5v1" stroke="white" stroke-width="2" stroke-linecap="round"/><rect x="3.5" y="8.5" width="7" height="3" rx="0.8" fill="white"/></svg>`,
  'Recupero': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 14C11 14 8 11 8 7.5 8 5.8 8.6 4.2 9.5 3 6 3.5 3.5 6.5 3.5 10a6.5 6.5 0 0 0 6.5 6.5c1.6 0 3-.5 4.1-1.4-.5.1-1 .1-1.6.1-.8 0-1.6-.1-2.3-.3z" fill="white"/></svg>`,
  'Cosa vorresti migliorare': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" stroke="white" stroke-width="1.5"/><circle cx="10" cy="10" r="4" stroke="white" stroke-width="1.2"/><circle cx="10" cy="10" r="1.5" fill="white"/></svg>`,
  'Open Listening 2025': `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 7c0-2.2-1.8-4-4-4H6C3.8 3 2 4.8 2 7s1.8 4 4 4h1l2 3 2-3h2c2.2 0 4-1.8 4-4z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><path d="M6.5 7h7M6.5 9.5h4" stroke="white" stroke-width="1" stroke-linecap="round"/></svg>`,
  'Passione': `<svg width="18" height="18" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M10 17S3 12 3 7.5A4.5 4.5 0 0 1 10 4.6 4.5 4.5 0 0 1 17 7.5C17 12 10 17 10 17z"/></svg>`,
  'Raccomandazione': `<svg width="18" height="18" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M10 2l2 4.1 4.5.7-3.3 3.2.8 4.5L10 12.4l-4 2.1.8-4.5L3.5 6.8l4.5-.7z"/></svg>`,
}

function groupIcon(group: string): string | null {
  const clean = stripEmoji(group)
  return GROUP_SVG[clean] ?? null
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
        style={{ background: 'linear-gradient(135deg, #17B8A6, #2E86DE)', color: '#fff' }}
      >{def.title}</div>
      {questions.map((q, i) => {
        const showGroup = q.group && q.group !== questions[i - 1]?.group
        return (
          <div key={q.id}>
            {showGroup && (
              <div
                className="cs-group-label"
                style={{ background: 'linear-gradient(135deg, #17B8A6, #2E86DE)', color: '#fff' }}
              >
                {groupIcon(q.group ?? '') && (
                  <span dangerouslySetInnerHTML={{ __html: groupIcon(q.group ?? '') ?? '' }} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }} />
                )}
                <span className="cs-group-label-text">{stripEmoji(q.group ?? '')}</span>
              </div>
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
