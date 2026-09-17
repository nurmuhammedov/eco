import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { ISearchParams } from '@/shared/types'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks/use-auth'
import { DEFAULT_STALE_TIME } from '@/shared/lib/query/stale-time'

const useData = <T>(
  endpoint: string,
  enabled: boolean = true,
  params?: ISearchParams,
  keys: (string | number)[] = [],
  staleTime: number = DEFAULT_STALE_TIME
) => {
  const { user } = useAuth()

  return useQuery<T, Error>({
    queryKey: [endpoint, params, ...keys, user?.role],
    queryFn: () => CommonService.getData<T>(endpoint, params),
    enabled,
    staleTime,
  })
}

export default useData
