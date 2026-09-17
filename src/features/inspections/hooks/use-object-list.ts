import { useQuery } from '@tanstack/react-query'
import { inspectionsApi } from '@/features/inspections/model/inspections.model'
import { QK_INSPECTION } from '@/shared/constants/query-keys'
import useCustomSearchParams from '../../../shared/hooks/api/use-search-params'

export const useObjectList = (enabled = true) => {
  const {
    paramsObject: { inspectionId = '' },
  } = useCustomSearchParams()

  return useQuery({
    queryKey: [QK_INSPECTION, inspectionId, 'list'],
    queryFn: () => inspectionsApi.getObjectList(inspectionId),
    enabled: enabled && !!inspectionId,
  })
}

export const useObjectListByPagination = () => {
  const {
    paramsObject: { inspectionId = '', page = 1, size = 10 },
  } = useCustomSearchParams()

  return useQuery({
    queryKey: [QK_INSPECTION, inspectionId, page, size],
    queryFn: () => inspectionsApi.getObjectListByPagination({ page, size }, inspectionId),
    enabled: !!inspectionId,
  })
}
