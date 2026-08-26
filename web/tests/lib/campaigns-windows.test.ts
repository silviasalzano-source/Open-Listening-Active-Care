import { describe, expect, it } from 'vitest'
import { isCompilationOpen, isEditOpen, type SurveyCampaignWindow } from '../../src/lib/campaigns/windows'

const baseCampaign: SurveyCampaignWindow = {
  compilation_window_start: '2026-01-01T00:00:00.000Z',
  compilation_window_end: '2026-01-31T23:59:59.000Z',
  edit_window_start: null,
  edit_window_end: null,
}

describe('isCompilationOpen', () => {
  it('returns true when now is inside the compilation window', () => {
    const now = new Date('2026-01-15T12:00:00.000Z')
    expect(isCompilationOpen(baseCampaign, now)).toBe(true)
  })

  it('returns false when now is before the compilation window', () => {
    const now = new Date('2025-12-31T23:59:59.000Z')
    expect(isCompilationOpen(baseCampaign, now)).toBe(false)
  })

  it('returns false when now is after the compilation window', () => {
    const now = new Date('2026-02-01T00:00:00.000Z')
    expect(isCompilationOpen(baseCampaign, now)).toBe(false)
  })

  it('treats the window boundaries as inclusive', () => {
    const start = new Date(baseCampaign.compilation_window_start)
    const end = new Date(baseCampaign.compilation_window_end)
    expect(isCompilationOpen(baseCampaign, start)).toBe(true)
    expect(isCompilationOpen(baseCampaign, end)).toBe(true)
  })
})

describe('isEditOpen', () => {
  it('returns false when no edit window is set', () => {
    const now = new Date('2026-01-15T12:00:00.000Z')
    expect(isEditOpen(baseCampaign, now)).toBe(false)
  })

  it('returns true when now is inside a configured edit window', () => {
    const campaign: SurveyCampaignWindow = {
      ...baseCampaign,
      edit_window_start: '2026-03-01T00:00:00.000Z',
      edit_window_end: '2026-03-07T23:59:59.000Z',
    }
    const now = new Date('2026-03-03T00:00:00.000Z')
    expect(isEditOpen(campaign, now)).toBe(true)
  })

  it('returns false when now is outside a configured edit window', () => {
    const campaign: SurveyCampaignWindow = {
      ...baseCampaign,
      edit_window_start: '2026-03-01T00:00:00.000Z',
      edit_window_end: '2026-03-07T23:59:59.000Z',
    }
    const now = new Date('2026-04-01T00:00:00.000Z')
    expect(isEditOpen(campaign, now)).toBe(false)
  })
})
