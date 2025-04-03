import { getTime } from '@/shared/lib/get-time';
import { useQuery } from '@tanstack/react-query';
import { districtsAPI } from '@/shared/api/dictionaries';

export const useDistrictSelectQueries = () => {
  return useQuery({
    queryKey: ['district-select'],
    staleTime: getTime(1, 'week'),
    queryFn: () => districtsAPI.list,
  });
};
