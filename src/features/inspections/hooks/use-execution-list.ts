import { useQuery } from '@tanstack/react-query'
import { inspectionsApi } from '@/features/inspections/model/inspections.model'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'

export const useExecutionList = (id?: string) => {
  const {
    paramsObject: { inspectionId, eliminated = false },
  } = useCustomSearchParams()

  return useQuery({
    queryKey: endpointKey('/inspection-executions', id, inspectionId, eliminated),
    queryFn: () => inspectionsApi.getExecutionList(id!),
    enabled: !!id,
    staleTime: 0,
  })
}
