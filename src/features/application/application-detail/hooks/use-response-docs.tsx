import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { applicationDetailApi } from '../model/application-detail.api'

export const useResponseDocs = () => {
  const { id } = useParams()

  return useQuery({
    queryKey: endpointKey('/appeals', id, 'reply-docs'),
    enabled: !!id,
    staleTime: 0,
    queryFn: () => applicationDetailApi.getResponseDocs(id!),
  })
}
