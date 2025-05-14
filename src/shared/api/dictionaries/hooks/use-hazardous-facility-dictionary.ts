import { useQuery } from '@tanstack/react-query';
import { hazardousFacilityAPI } from '@/shared/api/dictionaries';

export const useHazardousFacilityDictionarySelect = () => {
  return useQuery({
    queryKey: ['hazardous-facility-select'],
    queryFn: () => hazardousFacilityAPI.list(),
  });
};
