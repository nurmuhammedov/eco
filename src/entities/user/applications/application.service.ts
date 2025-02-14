import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { useTableFilters } from '@/shared/lib/use-table-filter';

export interface Application {
  id: string;
  objectName: string;
  objectId: string;
  totalScore: number;
  builder: string;
  inspector: string;
  completedDate: string;
}

export const fetchApplications = () => {
  const { filters } = useTableFilters('applications');
  return useQuery<ApiResponse<Application>>({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Application>>(
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
