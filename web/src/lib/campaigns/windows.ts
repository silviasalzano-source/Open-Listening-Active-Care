export type SurveyCampaignWindow = {
  compilation_window_start: string
  compilation_window_end: string
  edit_window_start: string | null
  edit_window_end: string | null
}

export function isCompilationOpen(campaign: SurveyCampaignWindow, now: Date): boolean {
  const start = new Date(campaign.compilation_window_start)
  const end = new Date(campaign.compilation_window_end)
  return now >= start && now <= end
}

export function isEditOpen(campaign: SurveyCampaignWindow, now: Date): boolean {
  if (!campaign.edit_window_start || !campaign.edit_window_end) {
    return false
  }
  const start = new Date(campaign.edit_window_start)
  const end = new Date(campaign.edit_window_end)
  return now >= start && now <= end
}
