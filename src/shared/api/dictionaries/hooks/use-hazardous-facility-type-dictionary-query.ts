import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { hazardousFacilityTypeAPI } from '../queries/hazardous-facility-type.api'

export const useHazardousFacilityTypeDictionarySelect = () =>
  useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: endpointKey(API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES_SELECT),
    queryFn: () => hazardousFacilityTypeAPI.list(),
  })
