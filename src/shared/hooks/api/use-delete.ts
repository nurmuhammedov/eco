import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

type DeleteId = string | number

/**
 * A delete against `endpoint/:id`. The id can be fixed when the hook is set up
 * or passed to `mutate` per row; the second wins, which is what a table needs.
 */
const useDelete = (endpoint: string, id?: DeleteId | boolean | null, successMessage = 'Muvaffaqiyatli o‘chirildi') => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeleteId | undefined>({
    mutationFn: (rowId) => {
      const target = rowId ?? (typeof id === 'string' || typeof id === 'number' ? id : undefined)

      if (target === undefined || target === '') {
        return Promise.reject(new Error(`${endpoint}: o‘chirish uchun identifikator berilmagan`))
      }

      return CommonService.deleteData(endpoint, target)
    },
    onSuccess: () => {
      invalidateEndpoint(queryClient, endpoint)
      if (successMessage) toast.success(successMessage)
    },
  })
}

export default useDelete
