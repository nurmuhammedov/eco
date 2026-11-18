import { describe, expect, it } from 'vitest'
import { ApplicationStatus } from '@/entities/application'
import { UserRoles } from '@/shared/types/user'
import { AppealDomain, getAppealDomain, getAppealPermissions, isOwnAppeal } from './appeal-permissions'

describe('getAppealDomain', () => {
  it.each(['REGISTER_TANKER', 'DEREGISTER_TANKER', 'RE_REGISTER_TANKER'])(
    'puts %s with the equipment, as the backend replies to it',
    (appealType) => {
      expect(getAppealDomain(appealType)).toBe(AppealDomain.HF_EQUIPMENT)
    }
  )
})

describe('getAppealPermissions', () => {
  it('lets the regional head assign an inspector to a new tanker registration', () => {
    const permissions = getAppealPermissions(UserRoles.REGIONAL, 'REGISTER_TANKER', ApplicationStatus.NEW)

    expect(permissions.canAssign).toBe(true)
    expect(permissions.canReject).toBe(true)
  })

  it('lets the inspector reply to a tanker registration in process', () => {
    const permissions = getAppealPermissions(UserRoles.INSPECTOR, 'REGISTER_TANKER', ApplicationStatus.IN_PROCESS)

    expect(permissions.canExecute).toBe(true)
  })
})

describe('isOwnAppeal', () => {
  const regional = { role: UserRoles.REGIONAL, id: 'u-regional', regionId: 5 }
  const inspector = { role: UserRoles.INSPECTOR, id: 'u-inspector', regionId: 5 }

  it('keeps a regional head to the appeals of their own region', () => {
    expect(isOwnAppeal(regional, { regionId: 5 })).toBe(true)
    expect(isOwnAppeal(regional, { regionId: 7 })).toBe(false)
  })

  it('leaves a supervisor’s reach to the backend', () => {
    expect(isOwnAppeal({ ...regional, isSupervisor: true }, { regionId: 7 })).toBe(true)
  })

  it('keeps an inspector to the appeals assigned to them', () => {
    expect(isOwnAppeal(inspector, { regionId: 5, executorId: 'u-inspector' })).toBe(true)
    expect(isOwnAppeal(inspector, { regionId: 5, executorId: 'u-other' })).toBe(false)
    expect(isOwnAppeal(inspector, { regionId: 5, executorId: null })).toBe(false)
  })

  it('holds nothing back while the backend does not send the region or the executor', () => {
    expect(isOwnAppeal(regional, {})).toBe(true)
    expect(isOwnAppeal(regional, { regionId: null })).toBe(true)
    expect(isOwnAppeal(inspector, { regionId: 7 })).toBe(true)
    expect(isOwnAppeal(regional, undefined)).toBe(true)
    expect(isOwnAppeal(undefined, { regionId: 7 })).toBe(true)
  })

  it('does not scope the other roles', () => {
    expect(isOwnAppeal({ role: UserRoles.HEAD, id: 'u-head' }, { regionId: 7, executorId: 'x' })).toBe(true)
    expect(isOwnAppeal({ role: UserRoles.MANAGER, id: 'u-manager' }, { regionId: 7, executorId: 'x' })).toBe(true)
  })

  it('takes every action away from an appeal that is not theirs', () => {
    expect(getAppealPermissions(UserRoles.REGIONAL, 'REGISTER_HF', ApplicationStatus.NEW, false)).toMatchObject({
      canAssign: false,
      canReject: false,
      canAgree: false,
    })
    expect(
      getAppealPermissions(UserRoles.INSPECTOR, 'REGISTER_HF', ApplicationStatus.IN_PROCESS, false).canExecute
    ).toBe(false)
  })
})
