import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import type { ApiResponse } from '@/shared/types/api'
import { toast } from 'sonner'

const QUERY_KEY = ['hybrid-mail-status']

/** MailSwitchDto: whether letters go out through the hybrid mail service */
interface HybridMailStatus {
  status: boolean
}

export const useGetHybridMailStatus = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<HybridMailStatus>>('/mail-switch')
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
      const previousStatus = queryClient.getQueryData<HybridMailStatus>(QUERY_KEY)
      queryClient.setQueryData<HybridMailStatus>(QUERY_KEY, { status: newData.status })
      return { previousStatus }
    },
    // The request has already shown its error toast; only the switch goes back
    onError: (_error, _status, context) => queryClient.setQueryData(QUERY_KEY, context?.previousStatus),
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi')
    },
  })
}
