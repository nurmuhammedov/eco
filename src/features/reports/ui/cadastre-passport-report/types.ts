export interface CadastrePassportReportItem {
  /** null - "Respublika bo‘yicha" qatori; hudud filtri berilganda bu qator kelmaydi. */
  regionId: number | null
  regionName: string
  totalCount: number
  awaitingCustomerCount: number
  inReviewCount: number
  awaitingBothCount: number
  awaitingFvvOnlyCount: number
  awaitingSesOnlyCount: number
  inCommitteeCount: number
  approvedCount: number
  rejectedCount: number
  rejectedByCustomerCount: number
  rejectedByFvvCount: number
  rejectedBySesCount: number
  rejectedByCommitteeCount: number
}
