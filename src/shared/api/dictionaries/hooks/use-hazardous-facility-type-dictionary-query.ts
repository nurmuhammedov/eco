import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { useQuery } from '@tanstack/react-query'
import { hazardousFacilityTypeAPI } from '@/shared/api/dictionaries'

export const useHazardousFacilityTypeDictionarySelect = () => {
  return useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: ['hazardous-facility-type-select'],
    queryFn: () => hazardousFacilityTypeAPI.list(),
  })
}
