import { useData } from '@/shared/hooks/api'

interface RiskCountResponse {
  lowCount: number
  mediumCount: number
  highCount: number
}

interface UseRiskAnalysisStatsProps {
  year: number
  quarter: number
  regionId?: string | null
}

export const useRiskAnalysisStats = ({ year, quarter, regionId }: UseRiskAnalysisStatsProps) => {
  const commonParams = {
    year,
    quarter: quarter.toString(),
    regionId: regionId?.toString(),
  }

  // Since we can't use loops for hooks, we have to call them individually
  // Or we could create a custom hook that accepts type and use it multiple times,
  // but the caller expects a single aggregated object.

  const { data: hfCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, { ...commonParams, type: 'HF' })
  const { data: irsCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, { ...commonParams, type: 'IRS' })
  const { data: elevCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    ...commonParams,
    type: 'ELEVATOR',
  })
  const { data: attrCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    ...commonParams,
    type: 'ATTRACTION',
  })
  const { data: xrayCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    ...commonParams,
    type: 'XRAY',
  })
  const { data: lpgCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    ...commonParams,
    type: 'LPG_POWERED',
  })

  const getAllCounts = (level: 'highCount' | 'mediumCount' | 'lowCount') => {
    return [
      { name: 'XICHO', count: hfCounts?.[level] || 0 },
      { name: 'INM', count: irsCounts?.[level] || 0 },
      { name: 'Lift', count: elevCounts?.[level] || 0 },
      { name: 'Attraksion', count: attrCounts?.[level] || 0 },
      { name: 'Rentgen', count: xrayCounts?.[level] || 0 },
      {
        name: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma',
        count: lpgCounts?.[level] || 0,
      },
    ]
  }

  const highRiskList = getAllCounts('highCount')
  const mediumRiskList = getAllCounts('mediumCount')
  const lowRiskList = getAllCounts('lowCount')

  const highRiskTotal = highRiskList.reduce((acc, item) => acc + item.count, 0)
  const mediumRiskTotal = mediumRiskList.reduce((acc, item) => acc + item.count, 0)
  const lowRiskTotal = lowRiskList.reduce((acc, item) => acc + item.count, 0)

  return {
    highRisk: highRiskTotal,
    mediumRisk: mediumRiskTotal,
    lowRisk: lowRiskTotal,
    highRiskList,
    mediumRiskList,
    lowRiskList,
  }
}
