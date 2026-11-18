import { describe, expect, it } from 'vitest'
import { earliestExamDate, hasPresentation, isAllowedExamDate, isRepeatAttempt } from './attempts'

// Wednesday
const today = new Date(2026, 10, 18, 9, 30)

describe('earliestExamDate', () => {
  it('lies fifteen working days ahead, weekends skipped', () => {
    expect(earliestExamDate(today)).toEqual(new Date(2026, 11, 9))
  })

  it('counts from the next working day on a weekend', () => {
    // Saturday 21 November → three weeks of working days
    expect(earliestExamDate(new Date(2026, 10, 21))).toEqual(new Date(2026, 11, 11))
  })
})

describe('isAllowedExamDate', () => {
  it('refuses a day inside the notice period', () => {
    expect(isAllowedExamDate(new Date(2026, 11, 8), today)).toBe(false)
  })

  it('accepts the earliest day and later', () => {
    expect(isAllowedExamDate(new Date(2026, 11, 9, 14, 0), today)).toBe(true)
    expect(isAllowedExamDate(new Date(2027, 0, 15), today)).toBe(true)
  })

  it('lets an exam set before the rule keep its day, but not move closer', () => {
    const current = new Date(2026, 10, 20, 10, 0)

    expect(isAllowedExamDate(new Date(2026, 10, 20), today, current)).toBe(true)
    expect(isAllowedExamDate(new Date(2026, 10, 19), today, current)).toBe(false)
  })
})

describe('attempts', () => {
  it('marks a repeat', () => {
    expect(isRepeatAttempt({ attempt: 1 })).toBe(false)
    expect(isRepeatAttempt({ attempt: 2 })).toBe(true)
  })

  it('offers the submission only after a second failure with a formed protocol', () => {
    expect(hasPresentation({ status: 'FAILED', attempt: 2, calendar: null }, 7)).toBe(true)
    expect(hasPresentation({ status: 'FAILED', attempt: 2, calendar: null }, null)).toBe(false)
    expect(hasPresentation({ status: 'FAILED', attempt: 1, calendar: null }, 7)).toBe(false)
    expect(hasPresentation({ status: 'PASSED', attempt: 2, calendar: null }, 7)).toBe(false)
  })
})
