import { useQuery } from '@tanstack/react-query'
import { applicationDetailApi } from '../model/application-detail.api'

export const useInspectorSelect = (
  enabled: boolean = true,
  isSupervisor?: boolean,
  officeId?: string | number,
  isHeadTypes?: boolean
) => {
  return useQuery({
    queryKey: ['inspector select', isSupervisor, officeId, isHeadTypes],
    queryFn: () =>
      isHeadTypes
        ? applicationDetailApi.getManagerListSelect()
        : applicationDetailApi.getInspectorListSelect(isSupervisor, officeId),
    enabled,
  })
}
