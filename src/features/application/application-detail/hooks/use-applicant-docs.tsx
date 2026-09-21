import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { applicationDetailApi } from '../model/application-detail.api'

export const useApplicantDocs = () => {
  const { id } = useParams()

  return useQuery({
    queryKey: endpointKey('/appeals', id, 'request-docs'),
    enabled: !!id,
    staleTime: 0,
    queryFn: () => applicationDetailApi.getApplicantDocs(id!),
  })
}
