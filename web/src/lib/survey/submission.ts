import type { SupabaseClient } from '@supabase/supabase-js'

export type SubmissionStatus = 'in_progress' | 'submitted'

export type Submission = {
  id: string
  campaign_id: string
  user_id: string
  status: SubmissionStatus
  submitted_at: string | null
  last_edited_at: string | null
  created_at: string
}

export async function getOrCreateSubmission(
  supabase: SupabaseClient,
  userId: string,
  campaignId: string
): Promise<Submission> {
  const { data: existing, error: selectError } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .eq('campaign_id', campaignId)
    .maybeSingle()

  if (selectError) {
    throw new Error(`Failed to fetch submission: ${selectError.message}`)
  }

  if (existing) {
    return existing
  }

  const { data: created, error: insertError } = await supabase
    .from('submissions')
    .insert({ user_id: userId, campaign_id: campaignId })
    .select('*')
    .single()

  if (insertError) {
    // 23505 = unique_violation: una richiesta concorrente (es. due tab
    // aperte) ha già creato la riga tra la select e la insert — rileggila.
    if (insertError.code === '23505') {
      const { data: retried, error: retryError } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .eq('campaign_id', campaignId)
        .single()

      if (retryError) {
        throw new Error(`Failed to fetch submission after conflict: ${retryError.message}`)
      }

      return retried
    }

    throw new Error(`Failed to create submission: ${insertError.message}`)
  }

  return created
}
