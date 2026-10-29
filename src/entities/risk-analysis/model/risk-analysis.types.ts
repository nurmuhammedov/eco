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
  /** Qayta xavf tahlili bali; null - qayta tahlil o'tkazilmagan */
  recheckScore?: number | null
  level: RiskAnalysisLevel | null
  /** Tavsiyanoma yuborilgan sana; null - yuborilmagan */
  warningDate: string | null
}

export type RiskAnalysisLevel = 'LOW' | 'MEDIUM' | 'HIGH'

/**
 * The card (and URL value) for analyses that came out HIGH again on the
 * recheck. The API is asked for them with `recheckLevel=HIGH` instead of a level.
 */
export const RECHECK_HIGH_LEVEL = 'RECHECK_HIGH'

/** The `level` / `recheckLevel` pair the list and region endpoints are filtered by */
export const riskLevelParams = (riskLevel: string) =>
  riskLevel === RECHECK_HIGH_LEVEL ? { recheckLevel: 'HIGH' } : { level: riskLevel === 'ALL' ? undefined : riskLevel }

/** Levels a recheck applies to: only HIGH results are rechecked */
export const RECHECK_LEVEL_FILTERS = ['ALL', 'HIGH', RECHECK_HIGH_LEVEL]

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
  /** Tavsiyanoma yuborilgan sana; null - yuborilmagan */
  warningDate?: string | null
}

/** CountByLevel (`GET /risk-analyses/count`) */
export interface RiskLevelCount {
  lowCount: number | null
  mediumCount: number | null
  highCount: number | null
  /** Qayta xavf tahlilida yana yuqori chiqqanlar soni */
  recheckHighCount?: number | null
}

/** CountDtoByRegion (`GET /risk-analyses/count/by-region`) */
export interface RiskRegionCount {
  regionId: number
  region: string | null
  count: number | null
  /** Hududda qayta xavf tahlili o'tkazilganlar soni */
  recheckCount?: number | null
}
