import { describe, expect, it } from 'vitest'
import { UserRoles } from '@/shared/types/user'
import { canUpdateRegistryType } from './can-update-registry'

describe('canUpdateRegistryType', () => {
  it('keeps devices closed to their owners for now', () => {
    expect(canUpdateRegistryType('CRANE', UserRoles.LEGAL)).toBe(false)
    expect(canUpdateRegistryType('BOILER', UserRoles.INDIVIDUAL)).toBe(false)
    expect(canUpdateRegistryType('container', UserRoles.LEGAL)).toBe(false)
  })

  it('lets owners edit their other records', () => {
    expect(canUpdateRegistryType('HF', UserRoles.LEGAL)).toBe(true)
    expect(canUpdateRegistryType('IRS', UserRoles.LEGAL)).toBe(true)
    expect(canUpdateRegistryType('XRAY', UserRoles.INDIVIDUAL)).toBe(true)
  })

  it('keeps the inspector rules as they were', () => {
    expect(canUpdateRegistryType('CRANE', UserRoles.INSPECTOR)).toBe(false)
    expect(canUpdateRegistryType('HF', UserRoles.INSPECTOR)).toBe(false)
    expect(canUpdateRegistryType('BOILER', UserRoles.INSPECTOR)).toBe(true)
    expect(canUpdateRegistryType('BOILER', UserRoles.MANAGER)).toBe(true)
  })
})
