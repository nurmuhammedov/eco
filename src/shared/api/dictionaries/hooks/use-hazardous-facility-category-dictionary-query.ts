import { getTime } from '@/shared/lib'
import { useQuery } from '@tanstack/react-query'
import { hazardousFacilityCategoryAPI } from '@/shared/api/dictionaries/queries/hazardous-facility-category.api'

export const useHazardousFacilityCategoryDictionarySelect = () => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: ['hazardous-facility-category-select'],
    queryFn: () => hazardousFacilityCategoryAPI.list(),
  })
}
