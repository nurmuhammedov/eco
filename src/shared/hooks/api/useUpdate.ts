import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const useUpdate = <TVariables extends object, TData, TError>(
  endpoint: string,
  id?: string | number | boolean | null,
  method: 'put' | 'patch' = 'put',
  successMessage: string = 'Updated successfully'
) => {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (data: TVariables) => {
      if (!id && id !== 0) {
        toast.error(
          `The operation cannot be completed because a valid ID was not provided. Please ensure you pass a valid ID when updating data at endpoint: ${endpoint}`
        )
        return Promise.reject()
      }

      return method === 'put'
        ? CommonService.updateData<TVariables, TData>(endpoint, data, id.toString())
        : CommonService.partialUpdateData<TVariables, TData>(endpoint, data, id.toString())
    },
    onSuccess: () => toast.success(successMessage),
  })
}

export default useUpdate
