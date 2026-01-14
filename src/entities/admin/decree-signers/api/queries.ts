import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { DECREE_SIGNERS_KEYS } from './keys'

interface DecreeSignersParams {
  page?: number
  size?: number
  belongType?: string
}

export const useDecreeSigners = (params: DecreeSignersParams) => {
  return useQuery({
    queryKey: DECREE_SIGNERS_KEYS.list(params),
    queryFn: async () => {
      console.log('useDecreeSigners params:', params)
      const response = await apiClient.get<any>('/decree-signers', params as any)
      const data = response.data?.data
      return {
        content: data?.content || [],
        page: data?.page || {},
      }
    },
  })
}
