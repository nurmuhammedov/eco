import { getTime } from '@/shared/lib/get-time'
import { useQuery } from '@tanstack/react-query'
import { FilterUserLogsDTO } from '../models/user-logs.types'
import { userLogsAPI } from '../models/user-logs.api'
import { userLogsKeys } from '../models/user-logs.query-keys'

export const useUserLogsList = (params: FilterUserLogsDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: userLogsKeys.list('user-logs', params),
    queryFn: () => userLogsAPI.getAll(params),
    placeholderData: (previousData) => previousData,
  })
}
