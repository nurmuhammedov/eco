import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import type { ApiResponse } from '@/shared/types/api'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'

const ENDPOINT = '/integration/iip/legal'

export interface LegalInfoByTin {
  legalName: string
  fullName: string
  legalAddress: string
  phoneNumber: string
}

/**
 * The state registry's record for a taxpayer number, which is what the expertise
 * and declaration forms look an organisation up with. Distinct from
 * `useLegalOrganizationQuery`: that one reads a profile this system already
 * holds, this one asks the external registry.
 */
export const useLegalInfoByTinQuery = (tin?: string | null, enabled: boolean = true) =>
  useQuery({
    queryKey: endpointKey(ENDPOINT, tin),
    queryFn: async () => {
      const response = await apiClient.post<ApiResponse<LegalInfoByTin>, { tin: string }>(ENDPOINT, { tin: tin! })

      return response.data?.data
    },
    enabled: enabled && !!tin,
    staleTime: DICTIONARY_STALE_TIME,
    retry: 1,
  })
