import { describe, expect, it } from 'vitest'
import { cellClassName, describeDay, formatDate, formatHours, monthRange } from './attendance-labels'

describe('attendance labels', () => {
  it('writes whole hours without a decimal and others with one', () => {
    expect(formatHours(8)).toBe('8')
    expect(formatHours(7.9)).toBe('7.9')
    expect(formatHours(null)).toBe('—')
  })

  it('gives the month as the API reads it, the last day included', () => {
    expect(monthRange(2026, 11)).toEqual({ from: '2026-11-01', to: '2026-11-30' })
    expect(monthRange(2028, 2)).toEqual({ from: '2028-02-01', to: '2028-02-29' })
  })

  it('shows a date the Uzbek way', () => {
    expect(formatDate('2026-11-04')).toBe('04.11.2026')
  })

  it('paints lateness yellow and lateness without the norm red, as the template does', () => {
    expect(cellClassName('PRESENT', 'LATE')).toContain('bg-amber-200')
    expect(cellClassName('PRESENT', 'LATE_INCOMPLETE')).toContain('bg-red-200')
    expect(cellClassName('INCOMPLETE')).toContain('bg-orange-100')
    expect(cellClassName('PRESENT')).toBe('')
  })

  it('tells on hover when the employee came and left, how late and who corrected it', () => {
    const text = describeDay(
      '2026-11-19',
      'Ch',
      {
        status: 'PRESENT',
        check_in: '09:10',
        check_out: '18:20',
        hours: 8,
        late_minutes: 10,
        note: 'Rahbar tasdiqladi',
        corrected: true,
      },
      null
    )

    expect(text.split('\n')).toEqual([
      '19.11.2026 (Ch)',
      'Ishda',
      'Keldi: 09:10, ketdi: 18:20',
      'Ishladi: 8 soat',
      'Kechikish: 10 daqiqa',
      'Izoh: Rahbar tasdiqladi',
      'HR tomonidan tuzatilgan',
    ])
  })
})
