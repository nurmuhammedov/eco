import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts'
import { toast } from 'sonner'
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts'

export function useRejectExecutionReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: any; data: any }) => inspectionsApi.rejectInspectionReport({ id, data }),
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi!')
      queryClient.invalidateQueries({ queryKey: [QK_INSPECTION] }).catch((err) => console.error(err))
      queryClient.invalidateQueries({ queryKey: ['/inspection-checklists'] }).catch((err) => console.error(err))
    },
  })
}
