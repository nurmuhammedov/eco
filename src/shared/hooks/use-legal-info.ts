import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'

export function useLegalInfo() {
  return useMutation({
    mutationFn: async (data: any) => await apiClient.post<any>(`/integration/iip/legal  `, data),
  })
}
