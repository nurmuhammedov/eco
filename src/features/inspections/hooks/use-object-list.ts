import { useQuery } from '@tanstack/react-query';
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts';
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts';
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts';

export const useObjectList = () => {
  const {
    paramsObject: { inspectionId = '', page = 1, size = 10 },
  } = useCustomSearchParams();

  return useQuery({
    queryKey: [QK_INSPECTION, inspectionId, page, size],
    queryFn: () => inspectionsApi.getObjectList({ page, size }, inspectionId),
    enabled: !!inspectionId,
  });
};
