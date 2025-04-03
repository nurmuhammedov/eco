import { getTime } from '@/shared/lib/get-time';
import { useQuery } from '@tanstack/react-query';
import { departmentsAPI } from '@/shared/api/dictionaries';

export const useDepartmentSelectQueries = () => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: ['department-select'],
    queryFn: () => departmentsAPI.list(),
  });
};
