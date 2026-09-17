import { useQuery } from '@tanstack/react-query'
import { inspectionsApi } from '@/features/inspections/model/inspections.model'
import { QK_INSPECTION } from '@/shared/constants/query-keys'
import useCustomSearchParams from '../../../shared/hooks/api/use-search-params'

export const useExecutionList = (id: any) => {
  const {
    paramsObject: { inspectionId, eliminated = false },
  } = useCustomSearchParams()

  return useQuery({
    queryKey: [QK_INSPECTION, 'execution list', id, inspectionId, eliminated],
    queryFn: () => inspectionsApi.getExecutionList(id),
    enabled: !!id,
    staleTime: 0,
  })
}
