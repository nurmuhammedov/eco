import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { ISearchParams } from '@/shared/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DEFAULT_STALE_TIME } from '@/shared/lib/query/stale-time'

const useDetail = <T>(
  endpoint: string,
  id?: string | number | boolean | null,
  enabled: boolean = true,
  params?: ISearchParams,
  staleTime: number = DEFAULT_STALE_TIME
) => {
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData<any>(['me'])

  const queryMethods = useQuery<T, Error>({
    queryKey: [endpoint, id, params, user?.role],
    queryFn: async () => {
      if (!id) {
        toast.error(
          `Unable to fetch data because a valid ID was not provided. Please ensure you pass a valid ID when fetching data from endpoint: ${endpoint}`
        )
        return Promise.reject()
      }

      return CommonService.getDetail<T>(endpoint, id.toString(), params)
    },
    enabled: enabled && !!id,
    staleTime,
  })

  const { data = undefined } = queryMethods || {}

  return {
    ...queryMethods,
    detail: data,
  }
}

export default useDetail
