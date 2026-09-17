import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

/**
 * A create against `endpoint`. The lists that endpoint feeds are refetched on
 * success, so a new row shows up without the caller invalidating by hand.
 */
const useAdd = <TVariables extends object, TData, TError>(
  endpoint: string,
  successMessage: string = 'Muvaffaqiyatli saqlandi!'
) => {
  const queryClient = useQueryClient()

  return useMutation<TData, TError, TVariables>({
    mutationFn: (data: TVariables) => CommonService.addData<TVariables, TData>(endpoint, data),
    onSuccess: () => {
      invalidateEndpoint(queryClient, endpoint)
      if (successMessage) toast.success(successMessage, { richColors: true })
    },
  })
}

export default useAdd
