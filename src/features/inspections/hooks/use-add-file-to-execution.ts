import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { toast } from 'sonner'
import { inspectionsApi } from '@/features/inspections/model/inspections.api'

export function useAddFileToExecution(id: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => inspectionsApi.addFileToInspectionReport({ id, data }),
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi!')
      invalidateEndpoint(queryClient, '/inspections').catch((err) => console.error(err))
      invalidateEndpoint(queryClient, '/inspection-checklists').catch((err) => console.error(err))
    },
  })
}
