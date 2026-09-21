import { useQuery } from '@tanstack/react-query'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { ISearchParams } from '@/shared/types'
import { useAuth } from '@/shared/hooks/use-auth'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DEFAULT_STALE_TIME } from '@/shared/lib/query/stale-time'

/** A single GET. The role is part of the key because the server answers it per role. */
const useData = <T>(
  endpoint: string,
  enabled: boolean = true,
  params?: ISearchParams,
  keys: (string | number)[] = [],
  staleTime: number = DEFAULT_STALE_TIME
) => {
  const { user } = useAuth()

  return useQuery<T, Error>({
    queryKey: endpointKey(endpoint, params, ...keys, user?.role),
    queryFn: () => CommonService.getData<T>(endpoint, params),
    enabled,
    staleTime,
  })
}

export default useData
