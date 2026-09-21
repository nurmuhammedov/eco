import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { toast } from 'sonner'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'

export function useDeleteChecklist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: riskAnalysisDetailApi.deleteChecklist,
    onSuccess: async () => {
      await invalidateEndpoint(queryClient, '/checklists')
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}
