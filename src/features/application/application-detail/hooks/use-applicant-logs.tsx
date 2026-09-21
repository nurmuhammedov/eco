import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { applicationDetailApi } from '../model/application-detail.api'

export const useApplicationLogs = (isShow: boolean = true) => {
  const { id } = useParams()

  return useQuery({
    queryKey: endpointKey('/execution-processes/appeal', id),
    enabled: !!id && isShow,
    queryFn: () => applicationDetailApi.getApplicationLogs(id!),
  })
}
