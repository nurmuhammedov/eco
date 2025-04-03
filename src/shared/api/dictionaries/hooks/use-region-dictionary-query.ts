import { getTime } from '@/shared/lib/get-time';
import { useQuery } from '@tanstack/react-query';
import { regionsAPI } from '@/shared/api/dictionaries';

export const useRegionSelectQueries = () => {
  return useQuery({
    queryKey: ['region-select'],
    staleTime: getTime(1, 'week'),
    queryFn: () => regionsAPI.list,
  });
};
