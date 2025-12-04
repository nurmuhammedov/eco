import { useQuery } from '@tanstack/react-query'
import { applicationDetailApi } from '../model/application-detail.api.ts'
import { useParams } from 'react-router-dom'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts'

export const useResponseDocs = () => {
  const { id } = useParams()
  return useQuery({
    queryKey: [QK_APPLICATIONS, 'RESPONSE_DOCS', id],
    staleTime: 0,
    queryFn: () => applicationDetailApi.getResponseDocs(id),
  })
}
