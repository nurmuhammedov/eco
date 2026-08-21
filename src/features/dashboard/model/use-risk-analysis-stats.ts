import { useData } from '@/shared/hooks/api'
import { DASHBOARD_STALE_TIME } from './use-dashboard-stats'

interface RiskCountResponse {
  lowCount: number
  mediumCount: number
  highCount: number
}

interface UseRiskAnalysisStatsProps {
  year: number
  month: string
  regionId?: string | null
  enabled?: boolean
}

type RiskLevelKey = 'lowCount' | 'mediumCount' | 'highCount'

const OBJECT_LABELS: Record<string, string> = {
  HF: 'XICHO',
  IRS: 'INM',
  ELEVATOR: 'Lift',
  ATTRACTION: 'Attraksion',
  XRAY: 'Rentgen',
  LPG_POWERED: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma',
}

export const useRiskAnalysisStats = ({ year, month, regionId, enabled = true }: UseRiskAnalysisStatsProps) => {
  const commonParams = {
    year,
    month,
    periodType: 'MONTHLY',
    regionId: regionId?.toString(),
  }

  // Called individually rather than in a loop so the hook order stays fixed.
  const hf = useData<RiskCountResponse>('/risk-analyses/count', enabled, { ...commonParams, type: 'HF' }, [], DASHBOARD_STALE_TIME) // prettier-ignore
  const irs = useData<RiskCountResponse>('/risk-analyses/count', enabled, { ...commonParams, type: 'IRS' }, [], DASHBOARD_STALE_TIME) // prettier-ignore
  const elevator = useData<RiskCountResponse>('/risk-analyses/count', enabled, { ...commonParams, type: 'ELEVATOR' }, [], DASHBOARD_STALE_TIME) // prettier-ignore
  const attraction = useData<RiskCountResponse>('/risk-analyses/count', enabled, { ...commonParams, type: 'ATTRACTION' }, [], DASHBOARD_STALE_TIME) // prettier-ignore
  const xray = useData<RiskCountResponse>('/risk-analyses/count', enabled, { ...commonParams, type: 'XRAY' }, [], DASHBOARD_STALE_TIME) // prettier-ignore
  const lpg = useData<RiskCountResponse>('/risk-analyses/count', enabled, { ...commonParams, type: 'LPG_POWERED' }, [], DASHBOARD_STALE_TIME) // prettier-ignore

  const byType: [string, RiskCountResponse | undefined][] = [
    ['HF', hf.data],
    ['IRS', irs.data],
    ['ELEVATOR', elevator.data],
    ['ATTRACTION', attraction.data],
    ['XRAY', xray.data],
    ['LPG_POWERED', lpg.data],
  ]

  const listFor = (level: RiskLevelKey) =>
    byType.map(([key, counts]) => ({ key, name: OBJECT_LABELS[key], count: counts?.[level] ?? 0 }))

  const highRiskList = listFor('highCount')
  const mediumRiskList = listFor('mediumCount')
  const lowRiskList = listFor('lowCount')

  const sum = (items: { count: number }[]) => items.reduce((total, item) => total + item.count, 0)

  return {
    highRisk: sum(highRiskList),
    mediumRisk: sum(mediumRiskList),
    lowRisk: sum(lowRiskList),
    highRiskList,
    mediumRiskList,
    lowRiskList,
    isLoading:
      enabled &&
      [hf, irs, elevator, attraction, xray, lpg].some((query) => query.isFetching && query.data === undefined),
  }
}
