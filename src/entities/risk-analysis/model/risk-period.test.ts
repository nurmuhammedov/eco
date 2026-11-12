import { describe, expect, it } from 'vitest'
import { getDefaultYearAndQuarterForRiskAnalysis } from '@/shared/utils/date'
import { riskPeriodParams } from './risk-analysis.types'

// Since 2026-11-12 the backend knows DAILY and QUARTERLY only: MONTHLY comes back as a conversion error
describe('riskPeriodParams', () => {
  it('asks for a quarter by year and quarter, with no month', () => {
    expect(riskPeriodParams('QUARTERLY', { year: '2026', quarter: '3', date: '2026-11-11' })).toEqual({
      periodType: 'QUARTERLY',
      year: '2026',
      quarter: '3',
    })
  })

  it('asks for a day by its date alone', () => {
    expect(riskPeriodParams('DAILY', { year: '2026', quarter: '3', date: '2026-11-11' })).toEqual({
      periodType: 'DAILY',
      date: '2026-11-11',
    })
  })
})

describe('getDefaultYearAndQuarterForRiskAnalysis', () => {
  it('opens on the quarter before the current one', () => {
    expect(getDefaultYearAndQuarterForRiskAnalysis(new Date(2026, 10, 12))).toEqual({ year: '2026', quarter: '3' })
    expect(getDefaultYearAndQuarterForRiskAnalysis(new Date(2026, 3, 1))).toEqual({ year: '2026', quarter: '1' })
  })

  it('goes back to the last quarter of the previous year in the first quarter', () => {
    expect(getDefaultYearAndQuarterForRiskAnalysis(new Date(2027, 0, 15))).toEqual({ year: '2026', quarter: '4' })
  })
})
