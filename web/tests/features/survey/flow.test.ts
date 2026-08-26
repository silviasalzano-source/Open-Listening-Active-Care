import { describe, expect, it } from 'vitest'
import type { FlowStep } from '../../../src/features/survey/types'
import { buildPhase1Flow, mascotBucket } from '../../../src/features/survey/flow'

describe('buildPhase1Flow', () => {
  it('produces the exact 10-step sequence for phase 1', () => {
    const flow = buildPhase1Flow()
    expect(flow.map((s) => s.kind)).toEqual([
      'intro', 'q1intro', 'q1', 'focus', 'q1', 'q1', 'q1intro', 'q1', 'result', 'transition',
    ])
  })

  it('places the team popup right before clima and the anno popup right after causa', () => {
    const flow = buildPhase1Flow()
    const teamIntro = flow[1]
    const clima = flow[2]
    const causa = flow[5]
    const annoIntro = flow[6]
    if (teamIntro.kind !== 'q1intro' || clima.kind !== 'q1') throw new Error('unexpected shape')
    expect(teamIntro.key).toBe('team')
    expect(clima.question.id).toBe('clima')
    if (causa.kind !== 'q1' || annoIntro.kind !== 'q1intro') throw new Error('unexpected shape')
    expect(causa.question.id).toBe('causa')
    expect(annoIntro.key).toBe('anno')
  })

  it('orders the four phase-1 questions correctly', () => {
    const flow = buildPhase1Flow()
    const questionIds = flow
      .filter((s): s is Extract<FlowStep, { kind: 'q1' }> => s.kind === 'q1')
      .map((s) => s.question.id)
    expect(questionIds).toEqual(['clima', 'termometro', 'causa', 'descrizione'])
  })
})

describe('mascotBucket', () => {
  it('maps levels to the correct bucket, matching the prototype boundaries', () => {
    expect(mascotBucket(1)).toBe('low')
    expect(mascotBucket(2)).toBe('low')
    expect(mascotBucket(3)).toBe('lowmid')
    expect(mascotBucket(4)).toBe('lowmid')
    expect(mascotBucket(5)).toBe('mid')
    expect(mascotBucket(6)).toBe('mid')
    expect(mascotBucket(7)).toBe('good')
    expect(mascotBucket(8)).toBe('good')
    expect(mascotBucket(9)).toBe('high')
    expect(mascotBucket(10)).toBe('high')
  })
})
