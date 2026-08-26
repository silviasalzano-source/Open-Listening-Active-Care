import { step1 } from '../../features/survey/data'

export const IDENTITY_QUESTION_IDS = ['nome', 'cognome'] as const

export const MANDATORY_QUESTION_IDS = [
  ...IDENTITY_QUESTION_IDS,
  ...step1.map((question) => question.id),
]

export const ALLOWED_QUESTION_IDS = [...MANDATORY_QUESTION_IDS, 'causa_altro']
