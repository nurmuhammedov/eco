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

  const responseData: any = queryMethods.data || {}
  const page = responseData.page

  const size = page?.size || params?.size || 10

  const totalElements = page?.totalElements ?? responseData.totalElements ?? responseData.total ?? responseData.count

  const computedTotalPages = totalElements ? Math.ceil(Number(totalElements) / Number(size)) : 0

  const totalPages = page?.totalPages ?? responseData.totalPages ?? computedTotalPages

  return {
    ...queryMethods,
    data: queryMethods.data,
    totalPages,
    totalElements,
  }
}

export default usePaginatedData
