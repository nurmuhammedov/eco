import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { useQuery } from '@tanstack/react-query'
import { hazardousFacilityCategoryAPI } from '@/shared/api/dictionaries/queries/hazardous-facility-category.api'

export const useHazardousFacilityCategoryDictionarySelect = () => {
  return useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: ['hazardous-facility-category-select'],
    queryFn: () => hazardousFacilityCategoryAPI.list(),
  })
}
