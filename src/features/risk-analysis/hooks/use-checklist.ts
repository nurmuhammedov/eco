import { useQuery } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useSearchParams } from 'react-router-dom'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'

export const useChecklist = () => {
  const [searchParams] = useSearchParams()
  const intervalId = searchParams.get('intervalId') || ''
  const objectId = searchParams.get('id') || ''
  const tin = searchParams.get('tin') || ''

  return useQuery({
    queryKey: endpointKey('/checklists', { intervalId, objectId, tin }),
    queryFn: () => riskAnalysisDetailApi.getChecklist({ intervalId, objectId, tin }),
  })
}
