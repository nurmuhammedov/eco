import { describe, expect, it } from 'vitest'
import { findTypeCounts, formatCount, orderCraneRows } from './rows'
import type { CraneReportRow, CraneTypeCount } from './types'

const counts = (childEquipmentId: number, totalCount: number): CraneTypeCount => ({
  childEquipmentId,
  name: `Tur ${childEquipmentId}`,
  totalCount,
  withPermitCount: 0,
  withoutPermitCount: 0,
  registeredCount: 0,
  permitAddedCount: 0,
  permitChangedCount: 0,
})

const row = (regionId: number | null, regionName: string, types: CraneTypeCount[] = []): CraneReportRow => ({
  regionId,
  regionName,
  totalCount: types.reduce((sum, type) => sum + type.totalCount, 0),
  types,
})

describe('orderCraneRows', () => {
  it('puts the country total first and names it the same way as the other reports', () => {
    const rows = orderCraneRows([
      row(5, 'Jizzax viloyati'),
      row(null, "Respublika bo'yicha"),
      row(7, 'Navoiy viloyati'),
    ])

    expect(rows.map((item) => item.regionName)).toEqual(['Respublika bo‘yicha', 'Jizzax viloyati', 'Navoiy viloyati'])
  })

  it('gives an empty table for no data', () => {
    expect(orderCraneRows(undefined)).toEqual([])
    expect(orderCraneRows(null)).toEqual([])
  })
})

describe('findTypeCounts', () => {
  it('finds a type by id, not by its place in the row', () => {
    const region = row(5, 'Jizzax viloyati', [counts(2, 7), counts(1, 15)])

    expect(findTypeCounts(region, 1)?.totalCount).toBe(15)
    expect(findTypeCounts(region, 3)).toBeUndefined()
  })
})

describe('formatCount', () => {
  it('groups thousands with a no-break space', () => {
    expect(formatCount(8769)).toBe('8\u00a0769')
    expect(formatCount(1234567)).toBe('1\u00a0234\u00a0567')
  })

  it('shows a missing count as zero', () => {
    expect(formatCount(undefined)).toBe('0')
    expect(formatCount(0)).toBe('0')
  })
})
