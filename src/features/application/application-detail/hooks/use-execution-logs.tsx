import { useQuery } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { applicationDetailApi } from '../model/application-detail.api'

export const useExecutionLogs = (
  id: string | undefined,
  type: 'appeal' | 'change' = 'appeal',
  isShow: boolean = true
) => {
  return useQuery({
    queryKey: endpointKey(`/execution-processes/${type}`, id),
    enabled: !!id && isShow,
    queryFn: () =>
      type === 'appeal' ? applicationDetailApi.getApplicationLogs(id!) : applicationDetailApi.getChangeLogs(id!),
  })
}
