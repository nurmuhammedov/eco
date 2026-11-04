import { describe, expect, it } from 'vitest'
import { RegisterActiveTab } from './register-tabs'
import { buildRegisterQuery, pinnedChildIds } from './build-register-query'

const equipmentsParams = (paramsObject: Record<string, string>) =>
  buildRegisterQuery({ tab: RegisterActiveTab.EQUIPMENTS, paramsObject, defaultRegionId: 'ALL' }).params

describe('pinnedChildIds', () => {
  it('asks the auto crane tab for both of its types until one is picked', () => {
    expect(pinnedChildIds('AUTO_CRANE', '')).toBe('31,35')
    expect(pinnedChildIds('AUTO_CRANE', '35')).toBe('35')
  })

  it('ignores a picked type the tab does not stand for', () => {
    expect(pinnedChildIds('AUTO_CRANE', '3')).toBe('31,35')
  })

  it('leaves tabs that are not pinned alone', () => {
    expect(pinnedChildIds('CRANE', '31')).toBeUndefined()
  })
})

describe('buildRegisterQuery for the auto crane tab', () => {
  it('narrows to the picked type through childEquipmentIds', () => {
    const params = equipmentsParams({ type: 'AUTO_CRANE', childEquipmentId: '31' })

    expect(params.type).toBe('CRANE')
    expect(params.childEquipmentIds).toBe('31')
    expect(params.childEquipmentId).toBe('')
  })
})

describe('buildRegisterQuery for tower cranes without a usage-rights file', () => {
  it('asks for the active ones that have no file', () => {
    const params = equipmentsParams({ type: 'TOWER_CRANE', status: 'NO_USAGE_RIGHTS' })

    expect(params.hasUsageRightsFile).toBe(false)
    expect(params.active).toBe(true)
    expect(params.status).toBe('')
    expect(params.childEquipmentIds).toBe('3')
  })

  it('leaves the filter out on every other status', () => {
    for (const status of ['ACTIVE', 'VALID', 'INVALID', 'EXPIRED', 'NO_DATE', 'CHANGED']) {
      expect(equipmentsParams({ type: 'TOWER_CRANE', status }).hasUsageRightsFile).toBe('')
    }
  })

  it('does not filter a type that has no such tab', () => {
    const params = equipmentsParams({ type: 'BOILER', status: 'NO_USAGE_RIGHTS' })

    expect(params.hasUsageRightsFile).toBe('')
    expect(params.active).toBe(true)
  })

  it('does not filter the archive', () => {
    const { params } = buildRegisterQuery({
      tab: RegisterActiveTab.EQUIPMENTS,
      paramsObject: { type: 'TOWER_CRANE', status: 'NO_USAGE_RIGHTS' },
      defaultRegionId: 'ALL',
      isArchive: true,
    })

    expect(params.hasUsageRightsFile).toBe('')
  })
})
