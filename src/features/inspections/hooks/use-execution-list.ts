import { useQuery } from '@tanstack/react-query';
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts';
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts';
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts';

export const useExecutionList = (id: any) => {
  const {
    paramsObject: { inspectionId, eliminated = false, page = 1, size = 10 },
  } = useCustomSearchParams();

  return useQuery({
    queryKey: [QK_INSPECTION, 'execution list', id, inspectionId, eliminated, page, size],
    queryFn: () => inspectionsApi.getExecutionList(id),
    enabled: !!id,
    staleTime: 0,
  });
};
