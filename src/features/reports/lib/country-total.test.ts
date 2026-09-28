import { describe, expect, it } from 'vitest'
import { isCountryTotal } from './country-total'

describe('isCountryTotal', () => {
  it('matches the label the backend sends, whatever the apostrophe', () => {
    expect(isCountryTotal("Respublika bo'yicha")).toBe(true)
    expect(isCountryTotal('Respublika bo‘yicha')).toBe(true)
    expect(isCountryTotal('Respublika bo’yicha')).toBe(true)
    expect(isCountryTotal('respublika BO‘YICHA ')).toBe(true)
    expect(isCountryTotal('Respublika')).toBe(true)
    expect(isCountryTotal("O'zbekiston Respublikasi")).toBe(true)
  })

  it('leaves the regions alone', () => {
    expect(isCountryTotal('Qoraqalpog‘iston Respublikasi')).toBe(false)
    expect(isCountryTotal('Toshkent shahri')).toBe(false)
    expect(isCountryTotal('')).toBe(false)
    expect(isCountryTotal(null)).toBe(false)
    expect(isCountryTotal(undefined)).toBe(false)
  })
})
