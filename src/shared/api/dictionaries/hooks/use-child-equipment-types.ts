import { getTime } from '@/shared/lib/get-time';
import { useQuery } from '@tanstack/react-query';
import { childEquipmentTypesAPI } from '@/shared/api/dictionaries';

export const useChildEquipmentTypes = (equipmentType?: string) => {
  return useQuery({
    enabled: !!equipmentType,
    queryKey: ['child equipment types', equipmentType],
    staleTime: getTime(1, 'week'),
    queryFn: () => childEquipmentTypesAPI.list(equipmentType),
  });
};
