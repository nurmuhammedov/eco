import { useFilters } from '@/shared/hooks';
import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

export const fetchApplications = () => {
  const { filters } = useFilters();
  return useQuery<ApiResponse<any>>({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<any>>(
        API_ENDPOINTS.LOGOUT,
        {
          page: filters.page,
          pageSize: filters.pageSize,
        },
      );
      return response.data;
    },
    initialData: [] as any,
  });
};

export function useFetchHPOTypes() {
  return useQuery<ApiResponse<any>>({
    queryKey: ['hpotypes'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<any>>(
        API_ENDPOINTS.USERS,
      );
      return response.data;
    },
  });
}
