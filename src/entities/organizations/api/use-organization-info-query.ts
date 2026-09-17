import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { ApiResponse } from '@/shared/types/api'

export interface OrganizationInfo {
  id: string
  fullName: string | null
  legalName: string | null
  regionId: number | null
  districtId: number | null
  phoneNumber: string | null
  pin: number | null
  tin: number | null
  legalAddress: string | null
  regionName: string | null
  districtName: string | null
}

export const useOrganizationInfoQuery = (tin: string | null) => {
  return useQuery({
    queryKey: endpointKey(API_ENDPOINTS.PROFILES_INFO, tin),
    queryFn: async () => {
      if (!tin) return null
      const { data } = await apiClient.get<ApiResponse<OrganizationInfo>>(API_ENDPOINTS.PROFILES_INFO, { tin })
      return data.data
    },
    enabled: !!tin,
  })
}
