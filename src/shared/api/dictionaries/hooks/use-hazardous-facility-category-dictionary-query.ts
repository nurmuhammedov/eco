import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { hazardousFacilityCategoryAPI } from '@/shared/api/dictionaries/queries/hazardous-facility-category.api'

export const useHazardousFacilityCategoryDictionarySelect = (inMultiCategory?: boolean) =>
  useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: endpointKey(API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES_SELECT, !!inMultiCategory),
    queryFn: () => hazardousFacilityCategoryAPI.list(inMultiCategory),
  })
