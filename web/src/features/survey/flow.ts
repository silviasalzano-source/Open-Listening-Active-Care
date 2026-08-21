import type { FlowStep } from './types'
import { step1 } from './data'

export function buildPhase1Flow(): FlowStep[] {
  const flow: FlowStep[] = [{ kind: 'intro' }]

  for (const question of step1) {
    if (question.id === 'clima') {
      flow.push({ kind: 'q1intro', key: 'team' })
    }
    flow.push({ kind: 'q1', question })
    if (question.id === 'causa') {
      flow.push({ kind: 'q1intro', key: 'anno' })
    }
  }

  flow.push({ kind: 'result' })
  flow.push({ kind: 'transition' })

  return flow
}

export type MascotBucket = 'low' | 'lowmid' | 'mid' | 'good' | 'high'

export function mascotBucket(level: number): MascotBucket {
  if (level <= 2) return 'low'
  if (level <= 4) return 'lowmid'
  if (level <= 6) return 'mid'
  if (level <= 8) return 'good'
  return 'high'
}
