import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { ISearchParams, ResponseData } from '@/shared/types'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/shared/hooks/use-auth'

const usePaginatedData = <T>(
  endpoint: string,
  params?: ISearchParams,
  enabled: boolean = true,
  staleTime: number = 0
) => {
  const { i18n } = useTranslation()
  const { user } = useAuth()

  const queryMethods = useQuery<ResponseData<T>, Error>({
    queryKey: [endpoint, params, i18n.language, user?.role],
    queryFn: () => CommonService.getPaginatedData<T>(endpoint, params),
    enabled,
    staleTime,
  })

  const { page } = queryMethods.data || {}

  return {
    ...queryMethods,
    data: queryMethods.data,
    totalPages: page?.totalPages,
  }
}

export default usePaginatedData
