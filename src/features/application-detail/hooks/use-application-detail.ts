import { applicationDetailApi } from '@/features/application-detail/model/application-detail.api';
import { useQuery } from '@tanstack/react-query';

export const useApplicationDetail = (id: string | number, filters: any) => {
  return useQuery({
    queryKey: [filters],
    staleTime: 0,
    queryFn: () => applicationDetailApi.get(id, filters),
  });
};
