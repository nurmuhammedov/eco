import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { DECREE_SIGNERS_KEYS } from './keys'
import { CreateDecreeSignerDto } from '../model/types'
import { toast } from 'sonner'

export const useCreateDecreeSigner = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDecreeSignerDto) => apiClient.post('/decree-signers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DECREE_SIGNERS_KEYS.all })
      toast.success('Muvaffaqiyatli qo‘shildi')
      onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xatolik yuz berdi')
    },
  })
}

export const useDeleteDecreeSigner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/decree-signers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DECREE_SIGNERS_KEYS.all })
      toast.success('Muvaffaqiyatli o‘chirildi')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Xatolik yuz berdi')
    },
  })
}
