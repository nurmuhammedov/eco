import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { useQuery } from '@tanstack/react-query'
import { hazardousFacilityAPI } from '@/shared/api/dictionaries'

export const useHazardousFacilityDictionarySelect = (enabled: boolean = true) => {
  return useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: ['hazardous-facility-select'],
    queryFn: () => hazardousFacilityAPI.list(),
    enabled,
  })
}
