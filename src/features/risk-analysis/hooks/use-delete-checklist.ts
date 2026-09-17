import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QK_CHECKLIST } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api'

export function useDeleteChecklist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: riskAnalysisDetailApi.deleteChecklist,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_CHECKLIST] })
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}
