import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { useQuery } from '@tanstack/react-query'
import { regionsAPI } from '../queries/regions.api'

export const useRegionSelectQueries = () => {
  return useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: ['region-select'],
    queryFn: () => regionsAPI.list(),
  })
}
