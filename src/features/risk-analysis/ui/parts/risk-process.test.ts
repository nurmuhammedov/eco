import { describe, expect, it } from 'vitest'
import { deriveRiskProcess } from './risk-process'
import type { RiskAnalysisData } from '../risk-analysis'

const analysis = (patch: Partial<RiskAnalysisData>): RiskAnalysisData => ({
  id: 'ra-1',
  identity: 123456789,
  type: 'HF',
  belongId: 'obj-1',
  totalScore: 85,
  status: 'ASSIGNED',
  indicators: {},
  startDate: '2026-04-01',
  endDate: '2026-06-30',
  inspectorName: null,
  assignedDate: null,
  level: 'HIGH',
  ...patch,
})

const states = (data: RiskAnalysisData) => deriveRiskProcess(data).map((step) => step.state)

describe('deriveRiskProcess', () => {
  it('ends at the result for a LOW analysis', () => {
    expect(states(analysis({ level: 'LOW', totalScore: 20 }))).toEqual(['done', 'skipped', 'skipped', 'skipped'])
  })

  it('waits for the warning on a fresh HIGH result', () => {
    expect(states(analysis({}))).toEqual(['done', 'active', 'pending', 'pending'])
  })

  it('waits for the recheck once the warning is out', () => {
    expect(states(analysis({ warningDate: '2026-07-10' }))).toEqual(['done', 'done', 'active', 'pending'])
  })

  it('waits for the inspection when the recheck stays HIGH', () => {
    const data = analysis({
      warningDate: '2026-07-10',
      recheckAt: '2026-08-01T10:15:00',
      recheckLevel: 'HIGH',
      recheckTotalScore: 90,
    })
    expect(states(data)).toEqual(['done', 'done', 'done', 'active'])
  })

  it('needs no inspection when the recheck comes out lower', () => {
    const data = analysis({
      warningDate: '2026-07-10',
      recheckAt: '2026-08-01T10:15:00',
      recheckLevel: 'MEDIUM',
      recheckTotalScore: 60,
    })
    expect(states(data)).toEqual(['done', 'done', 'done', 'skipped'])
  })

  it('is complete once the inspection is formed', () => {
    const data = analysis({
      warningDate: '2026-07-10',
      recheckAt: '2026-08-01T10:15:00',
      recheckLevel: 'HIGH',
      inspectionId: 'insp-1',
    })
    expect(states(data)).toEqual(['done', 'done', 'done', 'done'])
  })

  it('marks the middle steps not applied when an inspection came straight from the result', () => {
    expect(states(analysis({ inspectionId: 'insp-1' }))).toEqual(['done', 'skipped', 'skipped', 'done'])
  })
})
