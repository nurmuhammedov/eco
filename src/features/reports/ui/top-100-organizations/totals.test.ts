import { describe, expect, it } from 'vitest'
import { sumCounts, trainedTotal } from './totals'

const row = (
  managerCount: number,
  engineerCount: number,
  trainedManager: number | null,
  trainedEngineer: number | null
) => ({
  managerCount,
  engineerCount,
  workerCount: 10,
  total: managerCount + engineerCount + 10,
  trainedManagerCount: trainedManager,
  trainedEngineerCount: trainedEngineer,
})

describe('sumCounts', () => {
  it('sums every row the endpoint returned, a null counted as 0', () => {
    expect(sumCounts([row(12, 30, 8, 21), row(5, 7, null, 3), row(1, 0, null, null)])).toEqual({
      managerCount: 18,
      engineerCount: 37,
      workerCount: 30,
      total: 85,
      trainedManagerCount: 8,
      trainedEngineerCount: 24,
    })
  })

  it('is all zeros for no rows', () => {
    expect(Object.values(sumCounts([]))).toEqual([0, 0, 0, 0, 0, 0])
  })
})

describe('trainedTotal', () => {
  it('adds the two trained counts', () => {
    expect(trainedTotal({ trainedManagerCount: 8, trainedEngineerCount: 21 })).toBe(29)
  })

  it('counts a missing side as 0 when the other is known', () => {
    expect(trainedTotal({ trainedManagerCount: null, trainedEngineerCount: 3 })).toBe(3)
  })

  it('stays no data, not 0, when neither is synced yet', () => {
    expect(trainedTotal({ trainedManagerCount: null, trainedEngineerCount: null })).toBeNull()
  })
})
