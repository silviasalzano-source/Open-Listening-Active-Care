import type { SupabaseClient } from '@supabase/supabase-js'
import type { SurveyCampaignWindow } from '@/lib/campaigns/windows'

export type Campaign = SurveyCampaignWindow & {
  id: string
  name: string
}

export async function getActiveCampaign(supabase: SupabaseClient): Promise<Campaign | null> {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('survey_campaigns')
    .select(
      'id, name, compilation_window_start, compilation_window_end, edit_window_start, edit_window_end'
    )
    .lte('compilation_window_start', now)
    .gte('compilation_window_end', now)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch active campaign: ${error.message}`)
  }

  return data
}
