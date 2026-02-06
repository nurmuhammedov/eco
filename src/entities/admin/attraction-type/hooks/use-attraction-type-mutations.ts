import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { attractionTypeAPI } from '../models/attraction-type.api'

const ATTRACTION_TYPE_QUERY_KEY = 'attraction-type'

export const useCreateAttractionType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: attractionTypeAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTRACTION_TYPE_QUERY_KEY, 'list'] })
      toast.success('Attraksion tipi muvaffaqiyatli qo‘shildi')
    },
    onError: (error) => toast.error(`Xatolik: ${error.message}`),
  })
}

export const useUpdateAttractionType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: attractionTypeAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTRACTION_TYPE_QUERY_KEY, 'list'] })
      toast.success('Attraksion tipi muvaffaqiyatli yangilandi')
    },
    onError: (error) => toast.error(`Xatolik: ${error.message}`),
  })
}

export const useDeleteAttractionType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: attractionTypeAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTRACTION_TYPE_QUERY_KEY, 'list'] })
      toast.success('Attraksion tipi o‘chirildi')
    },
    onError: (error) => toast.error(`Xatolik: ${error.message}`),
  })
}
