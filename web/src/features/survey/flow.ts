import type { FlowStep, Phase2Question, ChapterKey } from './types'
import { step1, step2, chapters } from './data'

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

export function buildFullFlow(): FlowStep[] {
  const flow = buildPhase1Flow()

  // Group step2 questions by chapter
  const groups: { key: ChapterKey; questions: Phase2Question[] }[] = []
  let current: { key: ChapterKey; questions: Phase2Question[] } | null = null

  for (const q of step2) {
    if (q.chapter !== null) {
      current = { key: q.chapter, questions: [q] }
      groups.push(current)
    } else if (current) {
      current.questions.push(q)
    }
  }

  for (const group of groups) {
    const def = chapters[group.key]
    flow.push({ kind: 'chapter', key: group.key, def, questions: group.questions })
    flow.push({ kind: 'chapterSet', key: group.key, def, questions: group.questions })
  }

  flow.push({ kind: 'end' })
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
