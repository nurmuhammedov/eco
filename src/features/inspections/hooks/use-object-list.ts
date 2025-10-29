import { useQuery } from '@tanstack/react-query';
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts';
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts';
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts';

export const useObjectList = () => {
  const { paramsObject } = useCustomSearchParams();
  const type = paramsObject?.inspectionId || 'hf';

  return useQuery({
    queryKey: [QK_INSPECTION, paramsObject],
    queryFn: () => inspectionsApi.getObjectList(paramsObject, type.toUpperCase()),
  });
};
