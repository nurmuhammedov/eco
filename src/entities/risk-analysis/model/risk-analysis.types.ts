/** RiskAnalysisRes1 (`GET /risk-analyses`): an object with its latest score */
export interface RiskAnalysisItem {
  id: string
  belongId: string
  registryNumber: string | null
  name: string | null
  legalName: string | null
  legalTin: number | null
  address: string | null
  score: number | null
}

export type RiskAnalysisLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export type RiskAnalysisStatus = 'NEW' | 'ASSIGNED' | 'IN_PROCESS' | 'COMPLETED'

/** RiskAnalysisRes (`GET /risk-analyses/belongings`): one analysis period of an object */
export interface RiskAnalysisPeriod {
  id: string
  regionName: string | null
  totalScore: number | null
  inspectorName: string | null
  status: RiskAnalysisStatus | null
  level: RiskAnalysisLevel | null
  startDate: string | null
  endDate: string | null
  createdAt: string | null
  positiveCount: number | null
  negativeCount: number | null
}

/** CountByLevel (`GET /risk-analyses/count`) */
export interface RiskLevelCount {
  lowCount: number | null
  mediumCount: number | null
  highCount: number | null
}

/** CountDtoByRegion (`GET /risk-analyses/count/by-region`) */
export interface RiskRegionCount {
  regionId: number
  region: string | null
  count: number | null
}
