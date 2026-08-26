import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MANDATORY_QUESTION_IDS = ['nome', 'cognome', 'clima', 'termometro', 'causa', 'descrizione']

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: { submissionId?: string; questionId?: string; answer?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Corpo della richiesta non valido.' },
      { status: 400 }
    )
  }

  const { submissionId, questionId, answer } = body

  if (!submissionId || !questionId || answer === undefined) {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Campi mancanti.' },
      { status: 400 }
    )
  }

  const { error: upsertError } = await supabase
    .from('nominative_responses')
    .upsert(
      { submission_id: submissionId, question_id: questionId, answer },
      { onConflict: 'submission_id,question_id' }
    )

  if (upsertError) {
    // 42501 = insufficient_privilege: la RLS ha rifiutato la scrittura
    // (es. la finestra di compilazione/modifica non è più aperta).
    if (upsertError.code === '42501') {
      return NextResponse.json(
        {
          error: 'window_closed',
          message: 'La finestra di compilazione o modifica non è più aperta.',
        },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'save_failed', message: upsertError.message },
      { status: 500 }
    )
  }

  const { data: savedResponses, error: countError } = await supabase
    .from('nominative_responses')
    .select('question_id')
    .eq('submission_id', submissionId)
    .in('question_id', MANDATORY_QUESTION_IDS)

  if (countError) {
    return NextResponse.json(
      { error: 'save_failed', message: countError.message },
      { status: 500 }
    )
  }

  const allMandatoryAnswered = MANDATORY_QUESTION_IDS.every((id) =>
    savedResponses?.some((row) => row.question_id === id)
  )

  if (allMandatoryAnswered) {
    const { error: submitError } = await supabase
      .from('submissions')
      .update({ status: 'submitted', submitted_at: new Date().toISOString() })
      .eq('id', submissionId)
      .eq('status', 'in_progress')

    if (submitError) {
      return NextResponse.json(
        { error: 'submit_failed', message: submitError.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ ok: true })
}
