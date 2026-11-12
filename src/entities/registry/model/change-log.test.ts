import { describe, expect, it } from 'vitest'
import { isFileLog } from './change-log'

describe('isFileLog', () => {
  it('trusts the isFile flag', () => {
    expect(isFileLog({ isFile: true, fieldName: 'anything' })).toBe(true)
    expect(isFileLog({ isFile: true, fieldName: null })).toBe(true)
  })

  it('treats the deregistration and restore documents as files even without the flag', () => {
    for (const fieldName of ['restoreFile', 'deregisterFile', 'deregisterFilePath', 'deregisterBasisPath']) {
      expect(isFileLog({ isFile: false, fieldName })).toBe(true)
      expect(isFileLog({ isFile: null, fieldName })).toBe(true)
    }
  })

  it('leaves plain values as text', () => {
    expect(isFileLog({ isFile: false, fieldName: 'restoreReason' })).toBe(false)
    expect(isFileLog({ isFile: null, fieldName: 'deregisterReason' })).toBe(false)
    expect(isFileLog({ isFile: null, fieldName: null })).toBe(false)
  })
})
