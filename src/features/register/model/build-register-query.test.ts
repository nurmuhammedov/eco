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
