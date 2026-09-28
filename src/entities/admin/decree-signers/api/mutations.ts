import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { toast } from 'sonner'
import { DECREE_SIGNERS_KEYS } from './keys'
import type { CreateDecreeSignerDto } from '../model/types'

export const useCreateDecreeSigner = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDecreeSignerDto) => apiClient.post('/decree-signers', data),
    onSuccess: async () => {
      toast.success('Muvaffaqiyatli qo‘shildi')
      onSuccess?.()
      await queryClient.invalidateQueries({ queryKey: DECREE_SIGNERS_KEYS.all })
    },
  })
}

export const useDeleteDecreeSigner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/decree-signers/${id}`),
    onSuccess: async () => {
      toast.success('Muvaffaqiyatli o‘chirildi')
      await queryClient.invalidateQueries({ queryKey: DECREE_SIGNERS_KEYS.all })
    },
  })
}
