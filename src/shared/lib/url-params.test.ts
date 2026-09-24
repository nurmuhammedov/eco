import { describe, expect, it } from 'vitest'
import { paramNumber, paramOneOf, paramText } from './url-params'

describe('url params', () => {
  it('paramText turns parsed values back into text', () => {
    expect(paramText(2026)).toBe('2026')
    expect(paramText(true)).toBe('true')
    expect(paramText(undefined, 'ALL')).toBe('ALL')
    expect(paramText('', 'ALL')).toBe('ALL')
  })

  it('paramOneOf keeps a known value and rejects the rest', () => {
    const tabs = ['HF', 'IRS'] as const

    expect(paramOneOf('IRS', tabs, 'HF')).toBe('IRS')
    expect(paramOneOf('DROP TABLE', tabs, 'HF')).toBe('HF')
    expect(paramOneOf(undefined, tabs, 'HF')).toBe('HF')
  })

  it('paramNumber reads digits and refuses everything else', () => {
    expect(paramNumber(3, 1)).toBe(3)
    expect(paramNumber('7', 1)).toBe(7)
    expect(paramNumber('abc', 1)).toBe(1)
    expect(paramNumber(true, undefined)).toBeUndefined()
  })
})
