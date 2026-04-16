import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'

export const useHazardousFacilitySelectQuery = (legalTin?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['hf-select', legalTin],
    queryFn: async () => {
      const response = await apiClient.get<any>('/hf/by-tin/select', { legalTin })
      return (response.data?.data || []).map((item: any) => ({
        id: item.id,
        name: `${item.name} - ${item.registryNumber || ''}`,
      }))
    },
    enabled: !!(enabled && legalTin && (legalTin.length === 9 || legalTin.length === 14)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
