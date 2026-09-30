import { describe, expect, it } from 'vitest'
import { UserRoles } from '@/shared/types/user'
import { ApplicationCategory, ApplicationTypeEnum } from '../types/enums'
import { getApplicationAccess, isCategoryClosed } from './application-access'

describe('getApplicationAccess', () => {
  it('keeps the device, IRS and X-ray applications closed for now', () => {
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_CRANE, UserRoles.LEGAL)).toBe('disabled')
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_BOILER, UserRoles.INDIVIDUAL)).toBe('disabled')
    expect(getApplicationAccess(ApplicationTypeEnum.DEREGISTER_EQUIPMENT, UserRoles.LEGAL)).toBe('disabled')
    expect(getApplicationAccess(ApplicationTypeEnum.RE_REGISTER_EQUIPMENT, UserRoles.INDIVIDUAL)).toBe('disabled')
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_IRS, UserRoles.LEGAL)).toBe('disabled')
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_XRAY, UserRoles.LEGAL)).toBe('disabled')
  })

  it('leaves HF and accreditation open', () => {
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_HF, UserRoles.LEGAL)).toBe('allowed')
    expect(getApplicationAccess(ApplicationTypeEnum.ACCREDIT_EXPERT, UserRoles.LEGAL)).toBe('allowed')
  })

  it('leaves the inspectors’ and managers’ own registrations open', () => {
    expect(getApplicationAccess(ApplicationTypeEnum.ILLEGAL_REGISTER_BOILER, UserRoles.INSPECTOR)).toBe('allowed')
    expect(getApplicationAccess(ApplicationTypeEnum.ILLEGAL_REGISTER_CRANE, UserRoles.INSPECTOR)).toBe('allowed')
    expect(getApplicationAccess(ApplicationTypeEnum.ILLEGAL_REGISTER_ATTRACTION, UserRoles.INSPECTOR)).toBe('allowed')
    expect(getApplicationAccess(ApplicationTypeEnum.ILLEGAL_REGISTER_IRS, UserRoles.MANAGER)).toBe('allowed')
  })

  it('keeps the inspectors’ HF registration closed', () => {
    expect(getApplicationAccess(ApplicationTypeEnum.ILLEGAL_REGISTER_HF, UserRoles.INSPECTOR)).toBe('disabled')
  })

  it('does not judge an edit of an existing record', () => {
    expect(getApplicationAccess(ApplicationTypeEnum.REGISTER_CRANE, UserRoles.LEGAL, { isUpdate: true })).toBe(
      'allowed'
    )
  })
})

describe('isCategoryClosed', () => {
  it('names the tabs taken out of the grid', () => {
    expect(isCategoryClosed(ApplicationCategory.EQUIPMENTS)).toBe(true)
    expect(isCategoryClosed(ApplicationCategory.IRS)).toBe(true)
    expect(isCategoryClosed(ApplicationCategory.XRAY)).toBe(true)
    expect(isCategoryClosed(ApplicationCategory.HF)).toBe(false)
    expect(isCategoryClosed(ApplicationCategory.ACCREDITATION)).toBe(false)
    expect(isCategoryClosed(ApplicationCategory.ILLEGAL_IRS)).toBe(false)
  })
})
