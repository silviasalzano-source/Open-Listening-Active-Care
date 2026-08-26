import { describe, expect, it } from 'vitest'
import { IDENTITY_QUESTION_IDS, MANDATORY_QUESTION_IDS, ALLOWED_QUESTION_IDS } from '../../src/lib/survey/mandatory'

describe('mandatory question ids', () => {
  it('identity ids are exactly nome and cognome', () => {
    expect(IDENTITY_QUESTION_IDS).toEqual(['nome', 'cognome'])
  })

  it('mandatory ids are identity plus all four phase-1 questions, in order', () => {
    expect(MANDATORY_QUESTION_IDS).toEqual(['nome', 'cognome', 'clima', 'termometro', 'causa', 'descrizione'])
  })

  it('allowed ids additionally include causa_altro', () => {
    expect(ALLOWED_QUESTION_IDS).toEqual(['nome', 'cognome', 'clima', 'termometro', 'causa', 'descrizione', 'causa_altro'])
  })
})
