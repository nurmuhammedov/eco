import { useQuery } from '@tanstack/react-query';
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts';
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts';
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts';

export const useInspectionReports = () => {
  const { paramsObject } = useCustomSearchParams();
  const inspectionId = paramsObject?.inspectionId;

  return useQuery({
    queryKey: [QK_INSPECTION, 'list', inspectionId],
    queryFn: () => inspectionsApi.getInspectionList(inspectionId),
  });
};
