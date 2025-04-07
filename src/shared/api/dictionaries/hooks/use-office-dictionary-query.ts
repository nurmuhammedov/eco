import { getTime } from '@/shared/lib/get-time';
import { useQuery } from '@tanstack/react-query';
import { officeAPI } from '@/shared/api/dictionaries/queries/office.api';

export const useOfficeSelectQueries = () => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: ['department-select'],
    queryFn: () => officeAPI.list(),
  });
};
