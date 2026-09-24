import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { toast } from 'sonner'

export function useRejectDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applicationDetailApi.rejectDocument,
    onSuccess: async () => {
      await invalidateEndpoint(queryClient, '/appeals')
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}
