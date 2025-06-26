import { useQuery } from '@tanstack/react-query';
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts';
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts';
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts';

export const useObjectList = () => {
  const { paramsObject } = useCustomSearchParams();
  const type = paramsObject?.type || 'hf';
  let currentType = '';

  if (type.includes('attraction') || type.includes('elevator')) {
    currentType = 'equipments';
  } else {
    currentType = type;
  }
  return useQuery({
    queryKey: [QK_INSPECTION, paramsObject, currentType],
    queryFn: () => inspectionsApi.getObjectList({ ...paramsObject, type: type.toUpperCase() }, currentType),
  });
};
