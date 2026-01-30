import { useQuery } from '@tanstack/react-query'
import { applicationDetailApi } from '../model/application-detail.api.ts'

export const useInspectorSelect = (enabled: boolean = true, isSupervisor?: boolean) => {
  return useQuery({
    queryKey: ['inspector select', isSupervisor],
    queryFn: () => applicationDetailApi.getInspectorListSelect(isSupervisor),
    enabled,
  })
}
