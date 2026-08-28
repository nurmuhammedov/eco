import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { useQuery } from '@tanstack/react-query'
import { hazardousFacilityCategoryAPI } from '@/shared/api/dictionaries/queries/hazardous-facility-category.api'

export const useHazardousFacilityCategoryDictionarySelect = (inMultiCategory?: boolean) => {
  return useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: ['hazardous-facility-category-select', !!inMultiCategory],
    queryFn: () => hazardousFacilityCategoryAPI.list(inMultiCategory),
  })
}

/** The appeal detail returns category ids only, so names are looked up one by one. */
export const useHazardousFacilityCategoryDetail = (id?: number | string | null) => {
  return useQuery({
    enabled: !!id,
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: ['hazardous-facility-category', id],
    queryFn: () => hazardousFacilityCategoryAPI.detail(id!),
  })
}
