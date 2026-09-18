import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QK_INSPECTION } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import { inspectionsApi } from '@/features/inspections/model/inspections.model'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

export function useAddFileToExecution(id: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => inspectionsApi.addFileToInspectionReport({ id, data }),
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi!')
      queryClient.invalidateQueries({ queryKey: [QK_INSPECTION] }).catch((err) => console.error(err))
      invalidateEndpoint(queryClient, '/inspection-checklists').catch((err) => console.error(err))
    },
  })
}
