import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { useTableFilters } from '@/shared/lib/use-table-filter';
import { IApplication } from '@/entities/user/applications/model/model';

export const fetchApplications = () => {
  const { filters } = useTableFilters('applications');
  return useQuery<ApiResponse<IApplication>>({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IApplication>>(
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
