import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useConfirmDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (documentId: any) => await applicationDetailApi.confirmDocument(documentId),
    onSuccess: async () => {
      toast.success('Muvaffaqiyatli saqlandi!')
      await invalidateEndpoint(queryClient, '/appeals')
    },
  })
}
