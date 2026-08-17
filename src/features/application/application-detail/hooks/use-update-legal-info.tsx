import { QK_APPLICATIONS } from '@/shared/constants/query-keys'
import useUpdate from '@/shared/hooks/api/useUpdate'
import { useQueryClient } from '@tanstack/react-query'

export const useUpdateLegalInfo = (tinNumber: any) => {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useUpdate('/users/legal', tinNumber, 'put', 'Ma’lumotlarni muvaffaqiyatli yangilandi!')

  const handleUpdate = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS, 'APPLICANT_INFO', tinNumber] })
        },
      }
    )
  }

  return { handleUpdate, isPending }
}
