import { describe, expect, it } from 'vitest'
import { energyMascotSvgMarkup, mascotAnimClass, q1IntroMascotSvgMarkup } from '../../../src/features/survey/mascots'

describe('energyMascotSvgMarkup', () => {
  it('renders the low-energy face with the Zzz marker for level 1', () => {
    const markup = energyMascotSvgMarkup(1, 'test-clip')
    expect(markup).toContain('Zzz')
    expect(markup).toContain('id="test-clip"')
  })

  it('renders the high-energy face for level 10', () => {
    const markup = energyMascotSvgMarkup(10, 'test-clip')
    expect(markup).toContain('M43,95 Q60,120 77,95')
  })

  it('computes the energy meter height proportionally to the level', () => {
    const markupFull = energyMascotSvgMarkup(10, 'clip-a')
    const markupLow = energyMascotSvgMarkup(1, 'clip-b')
    expect(markupFull).toContain('height="84"')
    expect(markupLow).toContain('height="8"')
  })
})

describe('mascotAnimClass', () => {
  it('maps buckets to the correct animation class', () => {
    expect(mascotAnimClass(1)).toBe('mascot-tired')
    expect(mascotAnimClass(4)).toBe('mascot-tired')
    expect(mascotAnimClass(5)).toBe('mascot-idle')
    expect(mascotAnimClass(6)).toBe('mascot-idle')
    expect(mascotAnimClass(7)).toBe('mascot-good')
    expect(mascotAnimClass(8)).toBe('mascot-good')
    expect(mascotAnimClass(9)).toBe('mascot-hyper')
    expect(mascotAnimClass(10)).toBe('mascot-hyper')
  })
})

describe('q1IntroMascotSvgMarkup', () => {
  it('renders the walking group for the team variant', () => {
    const markup = q1IntroMascotSvgMarkup('team')
    expect(markup).toContain('chm-walk-a')
    expect(markup).toContain('chm-bubble')
  })

  it('renders the rotating seasons for the anno variant', () => {
    const markup = q1IntroMascotSvgMarkup('anno')
    expect(markup).toContain('q1i-rotate')
    expect(markup).toContain('❄️')
  })
})
