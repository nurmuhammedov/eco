import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CATEGORIES, defaultPeriodFor } from './categories'

describe('defaultPeriodFor', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('opens inspections on the current quarter’s first month', () => {
    vi.setSystemTime(new Date(2026, 10, 12))

    expect(defaultPeriodFor('inspection')).toEqual({ year: '2026', month: 'OCTOBER', quarter: '3' })
  })

  it('opens risk analysis on the last finished quarter', () => {
    vi.setSystemTime(new Date(2026, 10, 12))

    expect(defaultPeriodFor('risk')).toEqual({ year: '2026', month: 'OCTOBER', quarter: '3' })
  })

  it('takes each section’s own year in the first quarter', () => {
    vi.setSystemTime(new Date(2027, 0, 15))

    expect(defaultPeriodFor('inspection')).toEqual({ year: '2027', month: 'JANUARY', quarter: '4' })
    expect(defaultPeriodFor('risk')).toEqual({ year: '2026', month: 'JANUARY', quarter: '4' })
  })

  // An empty part is dropped from the request, and QUARTERLY without a quarter is a 400
  it('never leaves the month or the quarter empty', () => {
    vi.setSystemTime(new Date(2026, 10, 12))

    for (const { id } of CATEGORIES) {
      const period = defaultPeriodFor(id)

      expect(period.year).not.toBe('')
      expect(period.month).not.toBe('')
      expect(period.quarter).not.toBe('')
    }
  })
})
