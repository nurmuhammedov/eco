import { describe, expect, it } from 'vitest'
import { ApplicationStatus } from '@/entities/application'
import { UserRoles } from '@/shared/types/user'
import { AppealDomain, getAppealDomain, getAppealPermissions } from './appeal-permissions'

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
