import { ISearchParams } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { applicationListApi } from '../model/application-list.api';

export const useApplicationList = (filters: ISearchParams) => {
  return useQuery({
    queryKey: [filters],
    staleTime: 0,
    queryFn: () => applicationListApi.getAll(filters),
  });
};
