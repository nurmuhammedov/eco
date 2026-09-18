import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpdateApplicationFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { inspectionId?: string; filePath: string }) =>
      applicationDetailApi.uploadFile(payload, '/inspections/acknowledgement'),
    onSuccess: async () => {
      toast.success('Muvaffaqiyatli saqlandi!')
      await invalidateEndpoint(queryClient, '/appeals')
    },
    onError: (error: Error) => {
      toast.error(error.message || "Faylni yangilashda noma'lum xatolik")
    },
  })
}
