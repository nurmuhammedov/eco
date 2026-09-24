import { getTime } from '@/shared/lib/get-time'
import { useQuery } from '@tanstack/react-query'
import { FilterUserLogsDTO } from '../model/user-logs.types'
import { userLogsAPI } from '../model/user-logs.api'
import { userLogsKeys } from '../model/user-logs.query-keys'

export const useUserLogsList = (params: FilterUserLogsDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: userLogsKeys.list('user-logs', params),
    queryFn: () => userLogsAPI.getAll(params),
    placeholderData: (previousData) => previousData,
  })
}
