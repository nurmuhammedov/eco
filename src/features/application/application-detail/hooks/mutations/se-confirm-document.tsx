import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface ConfirmDocumentPayload {
  appealId: any
  documentId: any
  shouldRegister?: boolean
}

export function useConfirmDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ConfirmDocumentPayload) => await applicationDetailApi.confirmDocument(payload),
    onSuccess: async () => {
      await invalidateEndpoint(queryClient, '/appeals')
      toast.success('Muvaffaqiyatli saqlandi!')
    },
  })
}
