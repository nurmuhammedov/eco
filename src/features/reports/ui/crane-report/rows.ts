import type { CraneReportRow, CraneTypeCount } from './types'

export const COUNTRY_TOTAL_NAME = 'Respublika bo‘yicha'

/** The backend marks the country total by a null region; it heads the table, whatever order it comes in */
export const orderCraneRows = (data?: CraneReportRow[] | null): CraneReportRow[] => {
  const rows = Array.isArray(data) ? data : []

  return [
    ...rows.filter((row) => row.regionId === null).map((row) => ({ ...row, regionName: COUNTRY_TOTAL_NAME })),
    ...rows.filter((row) => row.regionId !== null),
  ]
}

/**
 * A region's counts for one crane type. The backend sends the types in the same
 * order in every row, but matching by id keeps a column right even if it ever does not.
 */
export const findTypeCounts = (row: CraneReportRow, childEquipmentId: number): CraneTypeCount | undefined =>
  row.types?.find((type) => type.childEquipmentId === childEquipmentId)

const NO_BREAK_SPACE = String.fromCharCode(0xa0)

/** `8769` → `8 769`, with a no-break space so a number never wraps */
export const formatCount = (value?: number | null) =>
  (value ?? 0).toLocaleString('ru-RU').replace(/\s/g, NO_BREAK_SPACE)
