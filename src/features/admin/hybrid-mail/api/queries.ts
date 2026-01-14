import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { toast } from 'sonner'

const QUERY_KEY = ['hybrid-mail-status']

interface HybridMailStatus {
  status: boolean
}

export const useGetHybridMailStatus = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get<any>('/mail-switch')
      return response.data.data
    },
  })
}

export const useUpdateHybridMailStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: HybridMailStatus) => {
      const response = await apiClient.put<HybridMailStatus>('/mail-switch', data)
      return response.data
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previousStatus = queryClient.getQueryData(QUERY_KEY)
      queryClient.setQueryData(QUERY_KEY, (old: any) => ({ ...old, status: newData.status }))
      return { previousStatus }
    },
    onError: (_err, _newTodo, context: any) => {
      queryClient.setQueryData(QUERY_KEY, context?.previousStatus)
      toast.error('Xatolik yuz berdi')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi')
    },
  })
}
