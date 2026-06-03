import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'

export const useRadiationProfileCheck = (tin?: string | null, type?: 'IRS' | 'XRAY') => {
  return useQuery({
    queryKey: ['radiation-profile-check', tin, type],
    queryFn: async () => {
      if (!tin || !type) return null
      // Using direct string interpolation to ensure the parameter is correctly passed to the backend
      const res = await apiClient.get<any>(`/radiation-profiles/check-by-tin/${tin}?type=${type}`)
      const result = res.data?.data
      return result === undefined ? res.data : result
    },
    enabled: !!tin && !!type,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
