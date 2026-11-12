import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RiskStatisticsCards } from './risk-statistics-cards'

vi.mock('@/shared/hooks', () => ({
  useData: () => ({ data: { lowCount: 1, mediumCount: 2, highCount: 3, recheckHighCount: 4 }, isLoading: false }),
}))

const RECHECK_CARD = 'Qayta tahlilda yana yuqori'

const renderCards = (props: Partial<Parameters<typeof RiskStatisticsCards>[0]> = {}) =>
  render(
    <RiskStatisticsCards
      type="HF"
      activeRiskLevel="LOW"
      onTabChange={() => {}}
      periodType="QUARTERLY"
      year="2026"
      quarter="3"
      {...props}
    />
  )

describe('RiskStatisticsCards', () => {
  it('shows the recheck card for the quarterly analysis', () => {
    renderCards()

    expect(screen.getByText(RECHECK_CARD)).toBeInTheDocument()
  })

  // The dynamics report sends the picked level to an API that knows LOW, MEDIUM and HIGH only
  it('leaves the recheck card out when asked to', () => {
    renderCards({ showRecheckCard: false, showAllCard: false })

    expect(screen.queryByText(RECHECK_CARD)).not.toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('has no recheck card for the daily analysis', () => {
    renderCards({ periodType: 'DAILY', date: '2026-11-11' })

    expect(screen.queryByText(RECHECK_CARD)).not.toBeInTheDocument()
  })
})
