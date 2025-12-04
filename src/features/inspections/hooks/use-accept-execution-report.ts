import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts'
import { toast } from 'sonner'
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts'

export function useAcceptExecutionReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => inspectionsApi.acceptInspectionReport(id),
    onSuccess: async () => {
      toast.success('Muvaffaqiyatli saqlandi!')
      await queryClient.invalidateQueries({ queryKey: [QK_INSPECTION] })
      await queryClient.invalidateQueries({ queryKey: ['/inspection-checklists'] })
    },
  })
}
