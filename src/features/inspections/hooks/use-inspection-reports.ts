import { useQuery } from '@tanstack/react-query'
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts'
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts'
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts'

export const useInspectionReports = () => {
  const {
    paramsObject: { inspectionId, eliminated = 'eliminated', page = 1, size = 10 },
  } = useCustomSearchParams()

  return useQuery({
    queryKey: [QK_INSPECTION, 'list', inspectionId, eliminated, page, size],
    queryFn: () =>
      inspectionsApi.getInspectionList({
        inspectionId,
        eliminated: eliminated === 'eliminated',
        page,
        size,
      }),
    staleTime: 6000,
  })
}
