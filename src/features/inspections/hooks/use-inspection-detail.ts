import { useQuery } from '@tanstack/react-query'
import { inspectionsApi } from '@/features/inspections/model/inspections.api'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'

export const useInspectionDetail = () => {
  const { paramsObject } = useCustomSearchParams()
  const inspectionId = paramsObject?.inspectionId

  return useQuery({
    queryKey: endpointKey('/inspections', inspectionId),
    queryFn: () => inspectionsApi.getInspectionDetail(inspectionId),
    enabled: !!inspectionId,
    staleTime: 6000,
  })
}
