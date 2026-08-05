import { useQuery } from '@tanstack/react-query'
import { officeAPI } from '@/shared/api/dictionaries/queries/office.api'

export const useOfficeSelectQueries = (enabled: boolean = true) => {
  return useQuery({
    staleTime: 0,
    queryKey: ['office-select'],
    queryFn: () => officeAPI.list(),
    enabled,
  })
}
