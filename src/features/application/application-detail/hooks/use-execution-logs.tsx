import { APPLICATION_LOGS } from '@/shared/constants/query-keys'
import { useQuery } from '@tanstack/react-query'
import { applicationDetailApi } from '../model/application-detail.api'

export const useExecutionLogs = (
  id: string | undefined,
  type: 'appeal' | 'change' = 'appeal',
  isShow: boolean = true
) => {
  return useQuery({
    queryKey: [APPLICATION_LOGS, id, type],
    enabled: !!id && isShow,
    queryFn: () =>
      type === 'appeal' ? applicationDetailApi.getApplicationLogs(id) : applicationDetailApi.getChangeLogs(id),
  })
}
