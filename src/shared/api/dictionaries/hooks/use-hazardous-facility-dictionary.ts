import { useQuery } from '@tanstack/react-query'
import { hazardousFacilityAPI } from '@/shared/api/dictionaries'

export const useHazardousFacilityDictionarySelect = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['hazardous-facility-select'],
    queryFn: () => hazardousFacilityAPI.list(),
    enabled,
  })
}
