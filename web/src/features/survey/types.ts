export type SingleIconOption = { icon: string; label: string; desc?: string }
export type MultiIconOption = { icon: string; label: string; hasInput?: boolean }

export type SingleIconQuestion = {
  id: string
  type: 'single-icon'
  title: string
  sub?: string
  options: SingleIconOption[]
}

export type MultiIconQuestion = {
  id: string
  type: 'multi-icon'
  max: number
  title: string
  sub?: string
  options: MultiIconOption[]
}

export type SliderQuestion = {
  id: string
  type: 'slider'
  title: string
  sub?: string
  messages: Record<number, [emoji: string, text: string]>
}

export type Phase1Question = SingleIconQuestion | MultiIconQuestion | SliderQuestion

// Phase 2 question types

export type SingleQuestion = {
  id: string
  type: 'single'
  title: string
  sub?: string
  options: string[]
}

export type Likert5Question = {
  id: string
  type: 'likert5'
  title: string
  sub?: string
  optional?: boolean
  alert?: string
  scaleLabels?: [string, string]
}

export type MultiQuestion = {
  id: string
  type: 'multi'
  max: number
  title: string
  sub?: string
  options: string[]
  hasInputOn?: string
}

export type NpsQuestion = {
  id: string
  type: 'nps'
  title: string
  sub?: string
}

export type Phase2Question = SingleQuestion | Likert5Question | MultiQuestion | NpsQuestion

export type ChapterKey =
  | 'profilo'
  | 'relazioni'
  | 'crescita'
  | 'valori'
  | 'energia2'
  | 'riflessione'
  | 'chiusura'

export type MascotType =
  | 'commute'
  | 'talk'
  | 'growth'
  | 'tech'
  | 'flow'
  | 'timeline'
  | 'finish'

export type ChapterDef = {
  mascot: MascotType
  title: string
  desc: string
}

export type FlowStep =
  | { kind: 'intro' }
  | { kind: 'q1intro'; key: 'team' | 'anno' }
  | { kind: 'q1'; question: Phase1Question }
  | { kind: 'result' }
  | { kind: 'transition' }
  | { kind: 'chapter'; key: ChapterKey; def: ChapterDef; questions: Phase2Question[] }
  | { kind: 'chapterSet'; key: ChapterKey; def: ChapterDef; questions: Phase2Question[] }
  | { kind: 'end' }

export type Phase1Answers = {
  clima?: string
  termometro?: number
  causa?: string[]
  causa_altro?: string
  descrizione?: string
}

export type SurveyAnswers = Record<string, string | string[] | number | undefined>
