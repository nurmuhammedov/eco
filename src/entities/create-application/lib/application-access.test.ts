import { describe, expect, it } from 'vitest'
import { UserRoles } from '@/shared/types/user'
import { ApplicationTypeEnum } from '../types/enums'
import { getApplicationAccess } from './application-access'

describe('getApplicationAccess', () => {
  it('keeps the device applications closed for now', () => {
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_CRANE, UserRoles.LEGAL)).toBe('disabled')
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_BOILER, UserRoles.INDIVIDUAL)).toBe('disabled')
    expect(getApplicationAccess(ApplicationTypeEnum.DEREGISTER_EQUIPMENT, UserRoles.LEGAL)).toBe('disabled')
    expect(getApplicationAccess(ApplicationTypeEnum.RE_REGISTER_EQUIPMENT, UserRoles.INDIVIDUAL)).toBe('disabled')
  })

  it('leaves the other categories open', () => {
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_HF, UserRoles.LEGAL)).toBe('allowed')
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_IRS, UserRoles.LEGAL)).toBe('allowed')
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_XRAY, UserRoles.LEGAL)).toBe('allowed')
  })

  it('does not judge an edit of an existing record', () => {
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_CRANE, UserRoles.LEGAL, { isUpdate: true })).toBe(
      'allowed'
    )
  })
})
