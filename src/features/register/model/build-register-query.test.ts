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

  it('asks the same of plain cranes and autocranes, each with its own child types', () => {
    const cranes = equipmentsParams({ type: 'CRANE', status: 'NO_USAGE_RIGHTS' })
    expect(cranes.hasUsageRightsFile).toBe(false)
    expect(cranes.active).toBe(true)

    const autoCranes = equipmentsParams({ type: 'AUTO_CRANE', status: 'NO_USAGE_RIGHTS' })
    expect(autoCranes.hasUsageRightsFile).toBe(false)
    expect(autoCranes.childEquipmentIds).toBe('31,35')
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

describe('buildRegisterQuery for the tanker tab', () => {
  it('asks for the plate the way the backend stores it', () => {
    const params = equipmentsParams({ type: 'TANKER', numberPlate: '01 a 123 bc' })

    expect(params.type).toBe('TANKER')
    expect(params.numberPlate).toBe('01A123BC')
  })
})

const archiveParams = (tab: RegisterActiveTab, paramsObject: Record<string, string>) =>
  buildRegisterQuery({ tab, paramsObject, defaultRegionId: 'ALL', isArchive: true }).params

describe('buildRegisterQuery for the archive restore requests', () => {
  it('asks for deregistered facilities with a pending change in the picked status', () => {
    const params = archiveParams(RegisterActiveTab.HF, { active: 'CHANGED', status: 'IN_PROCESS' })

    expect(params.active).toBe(false)
    expect(params.changed).toBe(true)
    expect(params.changeStatus).toBe('IN_PROCESS')
    expect(params.status).toBe('')
  })

  it('starts the facilities on the requests awaiting approval', () => {
    expect(archiveParams(RegisterActiveTab.HF, { active: 'CHANGED' }).changeStatus).toBe('IN_APPROVAL')
    expect(archiveParams(RegisterActiveTab.HF, { active: 'CHANGED', status: 'ALL' }).changeStatus).toBe('IN_APPROVAL')
    expect(archiveParams(RegisterActiveTab.HF, { active: 'CHANGED', status: 'NEW' }).changeStatus).toBe('IN_APPROVAL')
  })

  it('asks for deregistered equipment only, so active elevators stay out', () => {
    const params = archiveParams(RegisterActiveTab.EQUIPMENTS, {
      type: 'ELEVATOR',
      status: 'CHANGED',
      changeStatus: 'IN_APPROVAL',
    })

    expect(params.type).toBe('ELEVATOR')
    expect(params.active).toBe(false)
    expect(params.changed).toBe(true)
    expect(params.changeStatus).toBe('IN_APPROVAL')
    expect(params.status).toBe('INACTIVE')
  })

  it('starts the equipment on the requests awaiting approval', () => {
    expect(archiveParams(RegisterActiveTab.EQUIPMENTS, { status: 'CHANGED' }).changeStatus).toBe('IN_APPROVAL')
    expect(
      archiveParams(RegisterActiveTab.EQUIPMENTS, { status: 'CHANGED', changeStatus: 'IN_PROCESS' }).changeStatus
    ).toBe('IN_PROCESS')
  })

  it('leaves the plain archive lists as they were', () => {
    const hf = archiveParams(RegisterActiveTab.HF, {})
    expect(hf.active).toBe(false)
    expect(hf.changed).toBe('')
    expect(hf.changeStatus).toBe('')

    const equipments = archiveParams(RegisterActiveTab.EQUIPMENTS, {})
    expect(equipments.active).toBe(false)
    expect(equipments.changed).toBe('')
    expect(equipments.changeStatus).toBe('')
    expect(equipments.status).toBe('')
  })

  it('leaves the registry change tabs as they were', () => {
    const hf = buildRegisterQuery({
      tab: RegisterActiveTab.HF,
      paramsObject: { active: 'CHANGED', status: 'ALL' },
      defaultRegionId: 'ALL',
    }).params
    expect(hf.active).toBe(true)
    expect(hf.changed).toBe(true)
    expect(hf.changeStatus).toBe('')

    const equipments = equipmentsParams({ status: 'CHANGED', changeStatus: 'NEW' })
    expect(equipments.active).toBe('true')
    expect(equipments.changed).toBe(true)
    expect(equipments.changeStatus).toBe('NEW')
    expect(equipments.status).toBe('')
  })
})
