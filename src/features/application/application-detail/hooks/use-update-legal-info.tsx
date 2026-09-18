import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import useUpdate from '@/shared/hooks/api/use-update'
import { useQueryClient } from '@tanstack/react-query'

export const useUpdateLegalInfo = (tinNumber: any) => {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useUpdate('/users/legal', tinNumber, 'put', 'Ma’lumotlarni muvaffaqiyatli yangilandi!')

  const handleUpdate = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          invalidateEndpoint(queryClient, '/users/legal')
        },
      }
    )
  }

  return { handleUpdate, isPending }
}
