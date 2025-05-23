import { getTime } from '@/shared/lib';
import { useQuery } from '@tanstack/react-query';
import { hazardousFacilityTypeAPI } from '@/shared/api/dictionaries';

export const useHazardousFacilityTypeDictionarySelect = () => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: ['hazardous-facility-type-select'],
    queryFn: () => hazardousFacilityTypeAPI.list(),
  });
};
