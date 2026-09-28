export type PreventionBelongType = 'HF' | 'ELEVATOR' | 'ATTRACTION' | 'IRS' | 'XRAY' | 'LPG_POWERED'

export type PreventionStatus = 'NEW' | 'CONDUCTED' | 'CANCELLED'

/** PreventionType: the kind of preventive measure carried out */
export type PreventionType = 'HTST' | 'TSPA' | 'AQTT' | 'TFAO' | 'OEKT' | 'TSQT' | 'TSOT'

/** PreventionRes (`GET /preventions`) */
export interface PreventionRow {
  id: string
  registryNumber: string | null
  name: string | null
  ownerName: string | null
  identity: number | null
  address: string | null
  status: PreventionStatus | null
  executorName: string | null
  radiationProfileId: string | null
}

/** PreventionResById (`GET /preventions/{id}`) */
export interface PreventionDetail extends Omit<PreventionRow, 'radiationProfileId'> {
  belongType: PreventionBelongType | null
  belongId: string | null
  regionName: string | null
  type: PreventionType | null
  assigned: boolean | null
  report: string | null
  resultPathList: string[] | null
}

/** CountRes (`GET /preventions/count`) */
export interface PreventionCount {
  hfCount: number | null
  irsCount: number | null
  elevatorCount: number | null
  attractionCount: number | null
  xrayCount: number | null
  lpgPoweredCount: number | null
}

/** CountResByMonth (`GET /preventions/count/by-month`) */
export type PreventionCountByMonth = Partial<
  Record<
    | 'januaryCount'
    | 'februaryCount'
    | 'marchCount'
    | 'aprilCount'
    | 'mayCount'
    | 'juneCount'
    | 'julyCount'
    | 'augustCount'
    | 'septemberCount'
    | 'octoberCount'
    | 'novemberCount'
    | 'decemberCount',
    number | null
  >
>

/** PreventionExecutionDto */
export interface PreventionExecution {
  type: string
  report: string
  resultPathList: string[]
}
