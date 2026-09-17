import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { API_ENDPOINTS } from '@/shared/api/endpoints'

export type LegalOwnershipType = 'STATE' | 'NON_STATE'

export interface Organization {
  id: string
  name: string
  identity: number
  address: string | null
  legalForm: string | null
  legalOwnership: string | null
  legalOwnershipType: LegalOwnershipType | null
}

export interface FilterOrganizationDTO {
  page?: number
  size?: number
  identity?: string | number
  type?: string
  regionId?: number
  name?: string
  address?: string
  legalOwnership?: string
  legalForm?: string
  legalOwnershipType?: LegalOwnershipType
}

export const useOrganizationsQuery = (params: FilterOrganizationDTO) => {
  return useQuery({
    queryKey: endpointKey(API_ENDPOINTS.PROFILES_LEGALS, params),
    queryFn: async () => {
      const { data } = await apiClient.getWithPagination<Organization>(API_ENDPOINTS.PROFILES_LEGALS, { ...params })
      return data
    },
  })
}

export const useOrganizationCounts = (params: FilterOrganizationDTO) => {
  const fetchCount = async (legalOwnershipType?: LegalOwnershipType) => {
    const { data } = await apiClient.getWithPagination<Organization>(API_ENDPOINTS.PROFILES_LEGALS, {
      ...params,
      page: 1,
      size: 1,
      legalOwnershipType,
    })
    return data.page.totalElements
  }

  return useQuery({
    queryKey: endpointKey(API_ENDPOINTS.PROFILES_LEGALS, 'counts', params),
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
