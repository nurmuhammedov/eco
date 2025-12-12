import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import { RiskAnalysisTab } from '@/widgets/risk-analysis/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface AssignInspectorPayload {
  inspectorId: string
  riskAnalysisId: string
}

const getEndpoint = (type: RiskAnalysisTab) => {
  switch (type) {
    case RiskAnalysisTab.XICHO:
      return {
        id: API_ENDPOINTS.RISK_ASSESSMENT_HF,
        url: '/assign-inspector-hf',
      }
    case RiskAnalysisTab.INM:
      return {
        id: API_ENDPOINTS.RISK_ASSESSMENT_IRS,
        url: '/assign-inspector-irs',
      }
    case RiskAnalysisTab.ATTRACTION:
      return {
        id: API_ENDPOINTS.RISK_ASSESSMENT_ATTRACTIONS,
        url: '/assign-inspector-equipments',
      }
    case RiskAnalysisTab.LIFT:
      return {
        id: API_ENDPOINTS.RISK_ASSESSMENT_ELEVATORS,
        url: '/assign-inspector-equipments',
      }
    default:
      return {
        id: API_ENDPOINTS.RISK_ASSESSMENT_HF,
        url: '/assign-inspector-hf',
      }
  }
}

export const useAssignInspector = () => {
  const queryClient = useQueryClient()
  const { paramsObject } = useCustomSearchParams()
  const type = paramsObject.mainTab ?? (RiskAnalysisTab.XICHO as RiskAnalysisTab)

  return useMutation({
    mutationFn: (payload: AssignInspectorPayload) => {
      const endpoint = getEndpoint(type)
      return apiClient.post(endpoint.url, {
        ...payload,
      })
    },
    onSuccess: () => {
      toast.success('Inspektor muvaffaqiyatli biriktirildi!')
      queryClient.invalidateQueries({ queryKey: [getEndpoint(type)?.id] }).then((r) => console.log(r))
    },
  })
}
