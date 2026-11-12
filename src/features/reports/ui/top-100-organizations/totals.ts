/** ReportByTop100OrganizationByEmployeeCount */
export interface OrganizationEmployees {
  legalName: string
  regionName: string
  legalTin: number | null
  managerCount: number
  engineerCount: number
  workerCount: number
  /** managerCount + engineerCount + workerCount; the trained counts are not in it */
  total: number
  /** KTNU'da o'qigan, sertifikati amalda (STIR bo'yicha): synced nightly, null until then - which is not 0 */
  trainedManagerCount: number | null
  trainedEngineerCount: number | null
}

export type CountKey =
  | 'managerCount'
  | 'engineerCount'
  | 'workerCount'
  | 'total'
  | 'trainedManagerCount'
  | 'trainedEngineerCount'

const COUNT_KEYS: CountKey[] = [
  'managerCount',
  'engineerCount',
  'workerCount',
  'total',
  'trainedManagerCount',
  'trainedEngineerCount',
]

/** Both trained counts of a row together; no data on either side stays no data */
export const trainedTotal = (row: Pick<OrganizationEmployees, 'trainedManagerCount' | 'trainedEngineerCount'>) =>
  row.trainedManagerCount == null && row.trainedEngineerCount == null
    ? null
    : (row.trainedManagerCount ?? 0) + (row.trainedEngineerCount ?? 0)

/**
 * The totals row. The backend sends none, so it is summed here over everything
 * the endpoint returned - not only the rows on screen - with a null counted as 0.
 */
export const sumCounts = (rows: Partial<OrganizationEmployees>[]) =>
  Object.fromEntries(COUNT_KEYS.map((key) => [key, rows.reduce((sum, row) => sum + (row[key] ?? 0), 0)])) as Record<
    CountKey,
    number
  >
