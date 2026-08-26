import { describe, expect, it } from 'vitest'
import { computeResumeIndex } from '../../src/lib/survey/resume'
import { buildPhase1Flow } from '../../src/features/survey/flow'
import type { Phase1Answers } from '../../src/features/survey/types'

describe('computeResumeIndex', () => {
  it('returns the intro index (0) when there are no answers at all', () => {
    const flow = buildPhase1Flow()
    expect(computeResumeIndex(flow, {}, 'in_progress')).toBe(0)
  })

  it('returns the intro index (0) when identity (nome/cognome) is missing, even if some q1 answers exist', () => {
    const flow = buildPhase1Flow()
    const answers: Phase1Answers = { clima: 'Soleggiato' }
    expect(computeResumeIndex(flow, answers, 'in_progress')).toBe(0)
  })

  it('resumes at the first unanswered question, skipping the intervening q1intro popup', () => {
    const flow = buildPhase1Flow()
    const answers: Phase1Answers = {
      nome: 'Mario',
      cognome: 'Rossi',
      clima: 'Soleggiato',
      termometro: 7,
      causa: ['Carico di lavoro'],
    }
    const idx = computeResumeIndex(flow, answers, 'in_progress')
    const step = flow[idx]
    if (step.kind !== 'q1') throw new Error('expected a q1 step')
    expect(step.question.id).toBe('descrizione')
  })

  it('resumes at the first q1 step when identity is present but no question is answered yet', () => {
    const flow = buildPhase1Flow()
    const answers: Phase1Answers = { nome: 'Mario', cognome: 'Rossi' }
    const idx = computeResumeIndex(flow, answers, 'in_progress')
    const step = flow[idx]
    if (step.kind !== 'q1') throw new Error('expected a q1 step')
    expect(step.question.id).toBe('clima')
  })

  it('returns the result step index when status is submitted, regardless of answers', () => {
    const flow = buildPhase1Flow()
    const answers: Phase1Answers = {
      nome: 'Mario',
      cognome: 'Rossi',
      clima: 'Soleggiato',
      termometro: 7,
      causa: ['Carico di lavoro'],
      descrizione: 'Energia in Crescita',
    }
    const idx = computeResumeIndex(flow, answers, 'submitted')
    expect(flow[idx].kind).toBe('result')
  })
})
