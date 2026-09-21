import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

/**
 * An update against `endpoint/:id`. The id may arrive after the hook is set up,
 * so a missing one is rejected rather than sent - silently, because it means
 * the screen is still loading, which is nothing for the user to read about.
 */
const useUpdate = <TVariables extends object, TData, TError>(
  endpoint: string,
  id?: string | number | boolean | null,
  method: 'put' | 'patch' = 'put',
  successMessage: string = ''
) => {
  const queryClient = useQueryClient()

  return useMutation<TData, TError, TVariables>({
    mutationFn: (data: TVariables) => {
      if (!id && id !== 0) return Promise.reject(new Error(`${endpoint}: identifikator berilmagan`))

      return method === 'put'
        ? CommonService.updateData<TVariables, TData>(endpoint, data, id.toString())
        : CommonService.partialUpdateData<TVariables, TData>(endpoint, data, id.toString())
    },
    onSuccess: () => {
      invalidateEndpoint(queryClient, endpoint)
      if (successMessage) toast.success(successMessage, { richColors: true })
    },
  })
}

export default useUpdate
