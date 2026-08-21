import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { ISearchParams, ResponseData } from '@/shared/types'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks/use-auth'
import { DEFAULT_STALE_TIME } from '@/shared/lib/query/stale-time'

const usePaginatedData = <T>(
  endpoint: string,
  params?: ISearchParams,
  enabled: boolean = true,
  staleTime: number = DEFAULT_STALE_TIME
) => {
  const { user } = useAuth()

  const queryMethods = useQuery<ResponseData<T>, Error>({
    queryKey: [endpoint, params, user?.role],
    queryFn: () => CommonService.getPaginatedData<T>(endpoint, params),
    enabled,
    staleTime,
    // Turning a page or a filter changes the key, which would otherwise drop
    // the rows and blank the table on every step.
    placeholderData: (previous) => previous,
  })

  const responseData: any = queryMethods.data || {}
  const page = responseData.page

  const size = page?.size || params?.size || 10

  const totalElements = page?.totalElements ?? responseData.totalElements ?? responseData.total ?? responseData.count

  const computedTotalPages = totalElements ? Math.ceil(Number(totalElements) / Number(size)) : 0

  const totalPages = page?.totalPages ?? responseData.totalPages ?? computedTotalPages

  return {
    ...queryMethods,
    data: queryMethods.data,
    /**
     * Holding on to the previous page makes the query report success while the
     * new one is still in flight. Callers pass this straight to a busy state,
     * so it has to stay true until the real rows arrive.
     */
    isLoading: queryMethods.isLoading || queryMethods.isPlaceholderData,
    totalPages,
    totalElements,
  }
}

export default usePaginatedData
