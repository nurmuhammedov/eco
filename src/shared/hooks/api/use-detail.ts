import { useQuery } from '@tanstack/react-query'
import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { ISearchParams } from '@/shared/types'
import { useAuth } from '@/shared/hooks/use-auth'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DEFAULT_STALE_TIME } from '@/shared/lib/query/stale-time'

/** A GET of one record. Without an id there is nothing to ask for, so it waits. */
const useDetail = <T>(
  endpoint: string,
  id?: string | number | boolean | null,
  enabled: boolean = true,
  params?: ISearchParams,
  staleTime: number = DEFAULT_STALE_TIME
) => {
  const { user } = useAuth()

  const query = useQuery<T, Error>({
    queryKey: endpointKey(endpoint, id, params, user?.role),
    queryFn: () => CommonService.getDetail<T>(endpoint, String(id), params),
    enabled: enabled && !!id,
    staleTime,
  })

  return { ...query, detail: query.data }
}

export default useDetail
