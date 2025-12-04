import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QK_RISK_ANALYSIS } from '@/shared/constants/query-keys.ts'
import { toast } from 'sonner'
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api.ts'
import { useSearchParams } from 'react-router-dom'

export function useAttachFile() {
  const [searchParams] = useSearchParams()
  const currentType = searchParams.get('type') || 'equipmentId'

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, path }: { id: any; path: any }) =>
      await riskAnalysisDetailApi.attachFile({
        type: currentType,
        id,
        data: {
          path,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_RISK_ANALYSIS] })
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}
