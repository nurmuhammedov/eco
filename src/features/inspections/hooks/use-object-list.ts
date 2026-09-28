import { useQuery } from '@tanstack/react-query'
import { inspectionsApi } from '@/features/inspections/model/inspections.api'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'
import { paramNumber, paramText } from '@/shared/lib/url-params'

export const useObjectList = (enabled = true) => {
  const { paramsObject } = useCustomSearchParams()
  const inspectionId = paramText(paramsObject.inspectionId)

  return useQuery({
    queryKey: endpointKey('/inspections', inspectionId, 'objects'),
    queryFn: () => inspectionsApi.getObjectList(inspectionId),
    enabled: enabled && !!inspectionId,
  })
}

export const useObjectListByPagination = () => {
  const { paramsObject } = useCustomSearchParams()
  const inspectionId = paramText(paramsObject.inspectionId)
  const page = paramNumber(paramsObject.page, 1)
  const size = paramNumber(paramsObject.size, 10)

  return useQuery({
    queryKey: endpointKey('/risk-analyses/by-inspection', inspectionId, { page, size }),
    queryFn: () => inspectionsApi.getObjectListByPagination({ page, size }, inspectionId),
    enabled: !!inspectionId,
  })
}
