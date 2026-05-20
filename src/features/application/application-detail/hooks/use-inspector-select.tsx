import { useQuery } from '@tanstack/react-query'
import { applicationDetailApi } from '../model/application-detail.api.ts'

export const useInspectorSelect = (enabled: boolean = true, isSupervisor?: boolean, officeId?: string | number) => {
  return useQuery({
    queryKey: ['inspector select', isSupervisor, officeId],
    queryFn: () => applicationDetailApi.getInspectorListSelect(isSupervisor, officeId),
    enabled,
  })
}
