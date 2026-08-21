import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { useQuery } from '@tanstack/react-query'
import { officeAPI } from '@/shared/api/dictionaries/queries/office.api'

export const useOfficeSelectQueries = (enabled: boolean = true) => {
  return useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: ['office-select'],
    queryFn: () => officeAPI.list(),
    enabled,
  })
}
