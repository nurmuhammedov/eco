import { useQuery } from '@tanstack/react-query'
import { axiosInstance as api } from '@/shared/api'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { ApiResponse, ResponseData } from '@/shared/types/api'

export interface Organization {
  id: string
  name: string
  tin: string
  identity?: string
  address: string
  legalForm?: string
  legalOwnership?: string
  legalOwnershipType?: 'STATE' | 'NON_STATE'
  region?: {
    id: number
    name: string
  }
}

export interface FilterOrganizationDTO {
  page?: number
  size?: number
  identity?: string
  type?: string
  regionId?: number
  name?: string
  address?: string
  legalOwnership?: string
  legalForm?: string
  ownershipType?: 'STATE' | 'NON_STATE'
}

export const useOrganizationsQuery = (params: FilterOrganizationDTO) => {
  return useQuery({
    queryKey: ['organizations', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ResponseData<Organization>>>(API_ENDPOINTS.PROFILES_LEGALS, {
        params,
      })
      return data.data
    },
  })
}

export const useOrganizationCounts = (params: FilterOrganizationDTO) => {
  const fetchCount = async (ownershipType?: string) => {
    const { data } = await api.get<ApiResponse<ResponseData<Organization>>>(API_ENDPOINTS.PROFILES_LEGALS, {
      params: { ...params, page: 1, size: 1, ownershipType },
    })
    return data.data.page.totalElements
  }

  return useQuery({
    queryKey: ['organizations-counts', params],
    queryFn: async () => {
      const [all, state, nonState] = await Promise.all([
        fetchCount(undefined),
        fetchCount('STATE'),
        fetchCount('NON_STATE'),
      ])
      return { ALL: all, STATE: state, NON_STATE: nonState }
    },
  })
}
