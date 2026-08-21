import { describe, expect, it } from 'vitest'
import { step1 } from '../../../src/features/survey/data'

describe('step1', () => {
  it('has exactly the four phase-1 questions in order', () => {
    expect(step1.map((q) => q.id)).toEqual(['clima', 'termometro', 'causa', 'descrizione'])
  })

  it('gives the termometro question a message for every level 1-10', () => {
    const termometro = step1.find((q) => q.id === 'termometro')
    if (!termometro || termometro.type !== 'slider') throw new Error('termometro question missing or wrong type')
    for (let level = 1; level <= 10; level++) {
      expect(termometro.messages[level]).toBeDefined()
      expect(termometro.messages[level][1].length).toBeGreaterThan(0)
    }
  })

  it('limits causa to 2 selections and marks Altro as needing input', () => {
    const causa = step1.find((q) => q.id === 'causa')
    if (!causa || causa.type !== 'multi-icon') throw new Error('causa question missing or wrong type')
    expect(causa.max).toBe(2)
    expect(causa.options.find((o) => o.label === 'Altro')?.hasInput).toBe(true)
  })
})
