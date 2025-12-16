import { useQuery } from '@tanstack/react-query'
import { applicationDetailApi } from '../model/application-detail.api.ts'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts'

export const useLegalIipInfo = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: [QK_APPLICATIONS, 'APLICANT_INFO', id],
    queryFn: () => applicationDetailApi.getLegalIipInfo(id),
    enabled: enabled,
  })
}
