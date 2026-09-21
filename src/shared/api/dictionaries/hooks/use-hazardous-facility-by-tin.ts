import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import type { ApiResponse } from '@/shared/types/api'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'

const ENDPOINT = '/hf/by-tin/select'

export interface HazardousFacilityOption {
  id: string
  name: string
  registryNumber: string
  address: string
  regionId: string
  districtId: string
}

/**
 * The facilities one organisation owns, for the selects on the appeal and
 * accident forms. It used to be written out inline in seventeen of them, plus
 * twice more as its own hook - three query keys for one request, so a change to
 * any of them refreshed only part of the screen.
 */
export const useHazardousFacilityByTinQuery = (legalTin?: string | null, enabled: boolean = true) =>
  useQuery({
    queryKey: endpointKey(ENDPOINT, legalTin),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<HazardousFacilityOption[]>>(ENDPOINT, { legalTin })

      return response.data?.data ?? []
    },
    enabled: enabled && !!legalTin,
    staleTime: DICTIONARY_STALE_TIME,
  })

/** The same list as `{ id, name }` options, with the registry number in the label. */
export const useHazardousFacilitySelectQuery = (legalTin?: string, enabled: boolean = true) =>
  useQuery({
    queryKey: endpointKey(ENDPOINT, legalTin),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<HazardousFacilityOption[]>>(ENDPOINT, { legalTin })

      return response.data?.data ?? []
    },
    select: (options) => options.map((item) => ({ id: item.id, name: `${item.name} - ${item.registryNumber || ''}` })),
    enabled: !!(enabled && legalTin && (legalTin.length === 9 || legalTin.length === 14)),
    staleTime: DICTIONARY_STALE_TIME,
  })
