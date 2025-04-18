import { getTime } from '@/shared/lib/get-time';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  FilterTerritorialDepartmentsDTO,
  TerritorialDepartmentResponse,
  territorialDepartmentsAPI,
  territorialDepartmentsKeys,
} from '@/entities/admin/territorial-departments';

export const useTerritorialDepartmentsQuery = (filters: FilterTerritorialDepartmentsDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: territorialDepartmentsKeys.list('territorial-departments', filters),
    queryFn: () => territorialDepartmentsAPI.list(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useTerritorialDepartmentQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<
      TerritorialDepartmentResponse,
      Error,
      TerritorialDepartmentResponse,
      ReturnType<typeof territorialDepartmentsKeys.detail>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'week'),
    queryFn: () => territorialDepartmentsAPI.byId(id),
    queryKey: territorialDepartmentsKeys.detail('territorial-departments', id),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
