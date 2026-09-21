import { useQuery } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { useSearchParams } from 'react-router-dom'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'

export const useInspectorInfo = () => {
  const [searchParams] = useSearchParams()
  let currentType = searchParams.get('type') || ''
  const currentAssignParam = searchParams.get('assignId') || ''
  let currentAssignId

  if (currentAssignParam) {
    currentAssignId = ''
  } else {
    currentAssignId = currentAssignParam
  }

  if (currentType !== 'hf' && currentType !== 'irs') {
    currentType = 'equipments'
  }

  return useQuery({
    queryKey: endpointKey(`/assign-inspector-${currentType}`, currentAssignId),
    queryFn: () => riskAnalysisDetailApi.getInspectorInfo({ type: currentType, id: currentAssignId }),
    enabled: !!currentAssignId,
  })
}
