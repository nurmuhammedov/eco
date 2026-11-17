/** ReportByCrane.types[]: one crane type's counts in a region */
export interface CraneTypeCount {
  childEquipmentId: number
  name: string
  totalCount: number
  withPermitCount: number
  withoutPermitCount: number
  registeredCount: number
  permitAddedCount: number
  permitChangedCount: number
}

/** ReportByCrane: a region, or the country total when `regionId` is null */
export interface CraneReportRow {
  regionId: number | null
  regionName: string
  totalCount: number
  types: CraneTypeCount[]
}

export type CraneCountKey = Exclude<keyof CraneTypeCount, 'childEquipmentId' | 'name'>
