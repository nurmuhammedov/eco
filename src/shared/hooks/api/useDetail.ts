import { CommonService } from '@/shared/api/dictionaries/queries/comon.api'
import { ISearchParams } from '@/shared/types'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuth } from '@/shared/hooks/use-auth'

const useDetail = <T>(
  endpoint: string,
  id?: string | number | boolean | null,
  enabled: boolean = true,
  params?: ISearchParams,
  staleTime: number = 600000
) => {
  const { i18n } = useTranslation()
  const { user } = useAuth()

  const queryMethods = useQuery<T, Error>({
    queryKey: [endpoint, id, params, i18n.language, user?.role],
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
