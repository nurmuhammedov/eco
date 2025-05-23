import { ApiResponse } from '@/shared/types/api.ts';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

export const departmentsAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.DEPARTMENT_SELECT}`);

    return data.data;
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
    return data.data;
  },
};
