import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { useQuery } from '@tanstack/react-query'
import { districtsAPI } from '../queries/districts.api'

export const useDistrictSelectQueries = (regionId?: string) => {
  return useQuery({
    enabled: !!regionId && regionId !== 'ALL',
    queryKey: ['district-select', regionId],
    staleTime: DICTIONARY_STALE_TIME,
    queryFn: () => districtsAPI.list(regionId),
  })
}
