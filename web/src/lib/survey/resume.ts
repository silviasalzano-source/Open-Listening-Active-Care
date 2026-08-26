import type { FlowStep, Phase1Answers } from '@/features/survey/types'
import { IDENTITY_QUESTION_IDS } from './mandatory'

export function computeResumeIndex(
  flow: FlowStep[],
  answers: Phase1Answers,
  status: 'in_progress' | 'submitted'
): number {
  if (status === 'submitted') {
    const resultIdx = flow.findIndex((step) => step.kind === 'result')
    return resultIdx === -1 ? 0 : resultIdx
  }

  const hasIdentity = IDENTITY_QUESTION_IDS.every(
    (id) => answers[id as keyof Phase1Answers] !== undefined
  )
  if (!hasIdentity) {
    return 0
  }

  const firstUnanswered = flow.findIndex(
    (step) => step.kind === 'q1' && answers[step.question.id as keyof Phase1Answers] === undefined
  )

  return firstUnanswered === -1 ? 0 : firstUnanswered
}
