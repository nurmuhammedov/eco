import { useQuery } from '@tanstack/react-query';
import { regionsAPI } from '@/shared/api/dictionaries';

export const useRegionSelectQueries = () => {
  return useQuery({
    gcTime: 0,
    staleTime: 0,
    queryKey: ['region-select'],
    queryFn: () => regionsAPI.list(),
  });
};
