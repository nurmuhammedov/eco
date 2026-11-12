import { describe, expect, it } from 'vitest'
import { isRestoreChange } from './registry-change'

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
