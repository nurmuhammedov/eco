import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { regionsAPI } from '../queries/regions.api'

/**
 * Keyed by the endpoint so an edit in the admin panel reaches it: the same list
 * used to be cached twice under two hand-written keys, and invalidating one
 * left the other showing last week's data.
 */
export const useRegionSelectQuery = () =>
  useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: endpointKey(API_ENDPOINTS.REGIONS_SELECT),
    queryFn: () => regionsAPI.list(),
  })
