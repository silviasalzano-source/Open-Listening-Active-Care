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

export type FlowStep =
  | { kind: 'intro' }
  | { kind: 'q1intro'; key: 'team' | 'anno' }
  | { kind: 'q1'; question: Phase1Question }
  | { kind: 'result' }
  | { kind: 'transition' }

export type Phase1Answers = {
  clima?: string
  termometro?: number
  causa?: string[]
  causa_altro?: string
  descrizione?: string
}
