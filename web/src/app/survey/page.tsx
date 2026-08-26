// web/src/app/survey/page.tsx
import { requireRole } from '@/lib/auth/requireRole'
import { createClient } from '@/lib/supabase/server'
import { getActiveCampaign } from '@/lib/survey/activeCampaign'
import { getOrCreateSubmission } from '@/lib/survey/submission'
import { computeResumeIndex } from '@/lib/survey/resume'
import { buildFullFlow } from '@/features/survey/flow'
import { SurveyApp } from '@/features/survey/SurveyApp'
import { NoActiveCampaignScreen } from '@/features/survey/screens/NoActiveCampaignScreen'
import type { Phase1Answers } from '@/features/survey/types'

export default async function SurveyPage() {
  const { user } = await requireRole(['employee', 'hr_admin'])
  const supabase = await createClient()

  const campaign = await getActiveCampaign(supabase)
  if (!campaign) {
    return <NoActiveCampaignScreen />
  }

  try {
    const submission = await getOrCreateSubmission(supabase, user.id, campaign.id)

    const { data: responses, error } = await supabase
      .from('nominative_responses')
      .select('question_id, answer')
      .eq('submission_id', submission.id)

    if (error) {
      throw new Error(`Failed to fetch nominative responses: ${error.message}`)
    }

    const initialPhase1Answers = (responses ?? []).reduce<Phase1Answers>((acc, row) => {
      return { ...acc, [row.question_id]: row.answer }
    }, {})

    const flow = buildFullFlow()
    const initialIdx = computeResumeIndex(flow, initialPhase1Answers, submission.status)

    return (
      <SurveyApp
        submissionId={submission.id}
        initialPhase1Answers={initialPhase1Answers}
        initialIdx={initialIdx}
      />
    )
  } catch {
    // Qualsiasi errore a questo punto (inclusa la finestra di compilazione
    // che si chiude tra il lookup della campagna e l'insert della submission,
    // rigettato dalla RLS con 42501) rende il sondaggio non completabile per
    // il dipendente: la cosa più onesta da mostrare è lo stesso messaggio di
    // "nessun sondaggio attivo".
    return <NoActiveCampaignScreen />
  }
}
