import { useQuery } from '@tanstack/react-query'
import { applicationDetailApi } from '../model/application-detail.api'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys'

export const useLegalApplicantInfo = (id: any, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QK_APPLICATIONS, 'APPLICANT_INFO', id],
    enabled: !!id && enabled,
    queryFn: () => applicationDetailApi.getLegalApplicantInfo(id),
  })
}
