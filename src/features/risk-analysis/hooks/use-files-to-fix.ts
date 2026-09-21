import { useQuery } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { riskIndicatorsEndpoint } from '@/features/risk-analysis/model/risk-analysis-endpoints'
import { useSearchParams } from 'react-router-dom'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'

export const useFilesToFix = () => {
  const [searchParams] = useSearchParams()
  const currentType = searchParams.get('type') || ''
  const id = searchParams.get('id') || ''
  const tin = searchParams.get('tin') || ''
  const intervalId = searchParams.get('intervalId') || ''

  return useQuery({
    queryKey: endpointKey(`${riskIndicatorsEndpoint(currentType)}/to-fix`, { id, tin, intervalId }),
    queryFn: () => riskAnalysisDetailApi.getFilesToFix({ type: currentType, params: { id, tin, intervalId } }),
  })
}
