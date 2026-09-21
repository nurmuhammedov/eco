import { useQuery } from '@tanstack/react-query'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'
import { useSearchParams } from 'react-router-dom'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { riskIndicatorsEndpoint } from '@/features/risk-analysis/model/risk-analysis-endpoints'

export const useRiskAnalysisDetail = () => {
  const [searchParams] = useSearchParams()
  const tin = searchParams.get('tin')
  const id = searchParams.get('id')
  const type = searchParams.get('type')
  const intervalId = searchParams.get('intervalId')

  return useQuery({
    queryKey: endpointKey(`${riskIndicatorsEndpoint(type)}/for-one`, { intervalId, id, tin }),
    queryFn: () =>
      riskAnalysisDetailApi.getRiskItems(
        {
          intervalId,
          id,
          tin,
        },
        type
      ),
  })
}
