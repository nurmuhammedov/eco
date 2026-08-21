import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { useQuery } from '@tanstack/react-query'
import { departmentsAPI } from '@/shared/api/dictionaries'

export const useDepartmentSelectQueries = () => {
  return useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: ['department-select'],
    queryFn: () => departmentsAPI.list(),
  })
}
