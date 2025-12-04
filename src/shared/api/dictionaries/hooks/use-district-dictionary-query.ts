import { getTime } from '@/shared/lib/get-time'
import { useQuery } from '@tanstack/react-query'
import { districtsAPI } from '@/shared/api/dictionaries'

export const useDistrictSelectQueries = (regionId?: string) => {
  return useQuery({
    enabled: !!regionId,
    queryKey: ['district-select', regionId],
    staleTime: getTime(1, 'week'),
    queryFn: () => districtsAPI.list(regionId),
  })
}
