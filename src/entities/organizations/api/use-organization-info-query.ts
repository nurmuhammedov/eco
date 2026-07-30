import { useQuery } from '@tanstack/react-query'
import { axiosInstance as api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { ApiResponse } from '@/shared/types/api'

export interface OrganizationInfo {
  // Add fields based on what the API returns, for now generic any or basic fields
  name?: string
  tin?: string
  address?: string
  director?: string
  // ... other fields
  [key: string]: any
}

export const useOrganizationInfoQuery = (tin: string | null) => {
  return useQuery({
    queryKey: ['organization-info', tin],
    queryFn: async () => {
      if (!tin) return null
      const { data } = await api.get<ApiResponse<OrganizationInfo>>(API_ENDPOINTS.PROFILES_INFO, {
        params: { tin },
      })
      return data.data
    },
    enabled: !!tin,
  })
}
