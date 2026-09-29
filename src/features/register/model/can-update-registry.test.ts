import { describe, expect, it } from 'vitest'
import { UserRoles } from '@/shared/types/user'
import { canUpdateRegistryType } from './can-update-registry'

describe('canUpdateRegistryType', () => {
  it('keeps devices, IRS and X-ray closed to their owners for now', () => {
    expect(canUpdateRegistryType('CRANE', UserRoles.LEGAL)).toBe(false)
    expect(canUpdateRegistryType('container', UserRoles.INDIVIDUAL)).toBe(false)
    expect(canUpdateRegistryType('IRS', UserRoles.LEGAL)).toBe(false)
    expect(canUpdateRegistryType('XRAY', UserRoles.LEGAL)).toBe(false)
    expect(canUpdateRegistryType('XRAY', UserRoles.INDIVIDUAL)).toBe(false)
  })

  it('lets owners edit their HF records', () => {
    expect(canUpdateRegistryType('HF', UserRoles.LEGAL)).toBe(true)
    expect(canUpdateRegistryType('HF', UserRoles.INDIVIDUAL)).toBe(true)
  })

  it('leaves the staff rules as they were', () => {
    expect(canUpdateRegistryType('CRANE', UserRoles.INSPECTOR)).toBe(false)
    expect(canUpdateRegistryType('HF', UserRoles.INSPECTOR)).toBe(false)
    expect(canUpdateRegistryType('BOILER', UserRoles.INSPECTOR)).toBe(true)
    expect(canUpdateRegistryType('IRS', UserRoles.MANAGER)).toBe(true)
    expect(canUpdateRegistryType('XRAY', UserRoles.HEAD)).toBe(true)
  })
})
