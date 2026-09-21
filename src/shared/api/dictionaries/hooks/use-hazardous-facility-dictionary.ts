import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { hazardousFacilityAPI } from '../queries/hazardous-facility.api'

export const useHazardousFacilityDictionarySelect = (enabled: boolean = true) =>
  useQuery({
    enabled,
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: endpointKey(API_ENDPOINTS.HAZARDOUS_FACILITY_SELECT),
    queryFn: () => hazardousFacilityAPI.list(),
  })
