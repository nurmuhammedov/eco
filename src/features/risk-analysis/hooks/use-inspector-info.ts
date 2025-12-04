import { useQuery } from '@tanstack/react-query'
import { QK_RISK_ANALYSIS } from '@/shared/constants/query-keys.ts'
import { useSearchParams } from 'react-router-dom'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api.ts'

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
    queryKey: [QK_RISK_ANALYSIS, 'INSPECTOR_INFO', currentAssignId, currentType],
    queryFn: () => riskAnalysisDetailApi.getInspectorInfo({ type: currentType, id: currentAssignId }),
    enabled: !!currentAssignId,
  })
}
