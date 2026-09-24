import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { toast } from 'sonner'
import { inspectionsApi } from '@/features/inspections/model/inspections.api'

export function useRejectExecutionReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: any; data: any }) => inspectionsApi.rejectInspectionReport({ id, data }),
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi!')
      invalidateEndpoint(queryClient, '/inspections').catch((err) => console.error(err))
      invalidateEndpoint(queryClient, '/inspection-checklists').catch((err) => console.error(err))
    },
  })
}
