import { describe, expect, it } from 'vitest'
import { changeSectionOf, isActiveChange, isRestoreChange } from './registry-change'

describe('isRestoreChange', () => {
  it('recognises both restore types', () => {
    expect(isRestoreChange('RESTORE_HF')).toBe(true)
    expect(isRestoreChange('RESTORE_EQP')).toBe(true)
  })

  it('leaves the other change types out', () => {
    for (const type of ['UPDATE_HF', 'DEREGISTER_EQP', 'DEREGISTER_EQP_CRANE', 'CHANGE_HF_STATUS', 'RESTORE']) {
      expect(isRestoreChange(type)).toBe(false)
    }
  })

  it('is false when there is no type', () => {
    expect(isRestoreChange(null)).toBe(false)
    expect(isRestoreChange(undefined)).toBe(false)
    expect(isRestoreChange('')).toBe(false)
  })
})

describe('isActiveChange', () => {
  it('counts every unfinished stage as open', () => {
    for (const status of ['NEW', 'IN_PROCESS', 'IN_AGREEMENT', 'IN_APPROVAL']) {
      expect(isActiveChange({ status })).toBe(true)
    }
  })

  it('reads a confirmed and an auto-cancelled request as closed', () => {
    expect(isActiveChange({ status: 'COMPLETED' })).toBe(false)
    expect(isActiveChange({ status: 'AUTO_CANCELLED' })).toBe(false)
  })

  it('is false when there is no request', () => {
    expect(isActiveChange(null)).toBe(false)
    expect(isActiveChange(undefined)).toBe(false)
  })
})

describe('changeSectionOf', () => {
  it('maps every change type to the section its page lives in', () => {
    const expected: Record<string, string> = {
      UPDATE_HF: 'hf',
      DEREGISTER_HF: 'hf',
      CHANGE_HF_STATUS: 'hf',
      RESTORE_HF: 'hf',
      UPDATE_EQP: 'equipments',
      UPDATE_EQP_CRANE: 'equipments',
      DEREGISTER_EQP: 'equipments',
      DEREGISTER_EQP_CRANE: 'equipments',
      CHANGE_EQP_STATUS: 'equipments',
      RESTORE_EQP: 'equipments',
      UPDATE_IRS: 'irs',
      DEREGISTER_IRS: 'irs',
      UPDATE_XRAY: 'xrays',
      DEREGISTER_XRAY: 'xrays',
      UPDATE_R_PROFILE: 'radiation-profiles',
      CLOSE_INSPECTION: 'inspections',
    }

    for (const [type, section] of Object.entries(expected)) {
      expect(changeSectionOf(type)).toBe(section)
    }
  })

  it('leaves an unknown or missing type to the address', () => {
    expect(changeSectionOf('UPDATE_INQUIRY')).toBeUndefined()
    expect(changeSectionOf(null)).toBeUndefined()
  })
})
