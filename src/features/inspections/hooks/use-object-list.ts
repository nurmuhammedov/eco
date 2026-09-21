import { useQuery } from '@tanstack/react-query'
import { inspectionsApi } from '@/features/inspections/model/inspections.model'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'

export const useObjectList = (enabled = true) => {
  const {
    paramsObject: { inspectionId = '' },
  } = useCustomSearchParams()

  return useQuery({
    queryKey: endpointKey('/inspections', inspectionId, 'objects'),
    queryFn: () => inspectionsApi.getObjectList(inspectionId),
    enabled: enabled && !!inspectionId,
  })
}

export const useObjectListByPagination = () => {
  const {
    paramsObject: { inspectionId = '', page = 1, size = 10 },
  } = useCustomSearchParams()

  return useQuery({
    queryKey: endpointKey('/risk-analyses/by-inspection', inspectionId, { page, size }),
    queryFn: () => inspectionsApi.getObjectListByPagination({ page, size }, inspectionId),
    enabled: !!inspectionId,
  })
}
