import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api.ts'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts'
import { toast } from 'sonner'

export function useAttachInspector() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applicationDetailApi.attachInspector,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] })
      toast.success('Inspector attached successfully!')
    },
  })
}
