import { useQuery } from '@tanstack/react-query'
import { QK_RISK_ANALYSIS } from '@/shared/constants/query-keys.ts'
import { useSearchParams } from 'react-router-dom'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api.ts'

export const useFilesToFix = () => {
  const [searchParams] = useSearchParams()
  const currentType = searchParams.get('type') || ''
  const id = searchParams.get('id') || ''
  const tin = searchParams.get('tin') || ''
  const intervalId = searchParams.get('intervalId') || ''

  return useQuery({
    queryKey: [QK_RISK_ANALYSIS, 'FILES_TO_FIX', id, tin, intervalId],
    queryFn: () => riskAnalysisDetailApi.getFilesToFix({ type: currentType, params: { id, tin, intervalId } }),
  })
}
