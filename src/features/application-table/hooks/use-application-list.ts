import { applicationListApi } from '@/features/application-table/model/application-list.api';
import { useQuery } from '@tanstack/react-query';

export const useApplicationList = (filters: any) => {
  return useQuery({
    queryKey: [filters],
    staleTime: 0,
    queryFn: () => applicationListApi.getAll(filters),
  });
};
