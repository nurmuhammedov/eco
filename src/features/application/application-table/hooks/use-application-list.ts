import { ISearchParams } from '@/shared/types'
import { useQuery } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { applicationListApi } from '../model/application-list.api'

export const useApplicationList = (filters: ISearchParams) => {
  return useQuery({
    queryKey: endpointKey('/appeals', filters),
    staleTime: 0,
    queryFn: () => applicationListApi.getAll(filters),
  })
}
