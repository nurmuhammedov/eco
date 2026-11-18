import { describe, expect, it } from 'vitest'
import { RegisterActiveTab } from './register-tabs'
import {
  MINING_HF_CATEGORY_ID,
  MINING_HF_TAB,
  buildRegisterExportQuery,
  buildRegisterQuery,
  hfCategoryScope,
  pinnedChildIds,
} from './build-register-query'

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

describe('the mining and geology XICHO sub-tab', () => {
  const hfParams = (paramsObject: Record<string, string> = {}, isArchive = false) =>
    buildRegisterQuery({ tab: RegisterActiveTab.HF, paramsObject, isArchive, defaultRegionId: 'ALL' }).params

  it('lists only the registered XICHOs of category 15', () => {
    const params = hfParams({ active: MINING_HF_TAB, status: '' })

    expect(params).toMatchObject({ categoryIds: MINING_HF_CATEGORY_ID, active: true, status: '', changed: '' })
    expect(params.excludeCategoryIds).toBeUndefined()
  })

  it('leaves them out of the registry, active and inactive lists, the way the crane tab leaves out its split-off types', () => {
    for (const active of ['true', 'VALID', 'INVALID']) {
      const params = hfParams({ active })

      expect(params.excludeCategoryIds).toBe(MINING_HF_CATEGORY_ID)
      expect(params.categoryIds).toBeUndefined()
    }
    expect(hfParams().excludeCategoryIds).toBe(MINING_HF_CATEGORY_ID)
  })

  it('keeps the change requests, the archive and the report links whole', () => {
    for (const params of [
      hfParams({ active: 'CHANGED', status: 'NEW' }),
      hfParams({}, true),
      hfParams({ active: 'CHANGED', status: 'IN_APPROVAL' }, true),
      hfParams({ reportChangeBelongType: 'DEREGISTER_HF' }),
    ]) {
      expect(params.categoryIds).toBeUndefined()
      expect(params.excludeCategoryIds).toBeUndefined()
    }
  })

  it('exports each sub-tab with its own split', () => {
    const exported = (active: string) =>
      buildRegisterExportQuery({ tab: RegisterActiveTab.HF, paramsObject: { active }, defaultRegionId: 'ALL' })?.params

    expect(exported(MINING_HF_TAB)).toMatchObject({ categoryIds: '15' })
    expect(exported('true')).toMatchObject({ excludeCategoryIds: '15' })
  })

  it('answers the category filter of each sub-tab', () => {
    expect(hfCategoryScope(MINING_HF_TAB)).toEqual({ categoryIds: '15' })
    expect(hfCategoryScope('true')).toEqual({ excludeCategoryIds: '15' })
    expect(hfCategoryScope('CHANGED')).toEqual({})
    expect(hfCategoryScope('false', true)).toEqual({})
  })
})
