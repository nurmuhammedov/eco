import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { riskIndicatorsEndpoint } from '@/features/risk-analysis/model/risk-analysis-endpoints'
import { toast } from 'sonner'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'
import { useSearchParams } from 'react-router-dom'

export function useCancelPoints() {
  const [searchParams] = useSearchParams()
  const currentType = searchParams.get('type') || 'equipmentId'

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: any) =>
      await riskAnalysisDetailApi.cancelPoints({
        type: currentType,
        id,
        data: {},
      }),
    onSuccess: async () => {
      await invalidateEndpoint(queryClient, riskIndicatorsEndpoint(currentType))
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}
