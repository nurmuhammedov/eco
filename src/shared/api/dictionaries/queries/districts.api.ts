import { ApiResponse } from '@/shared/types/api.ts';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

export const districtsAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.DISTRICT_SELECT}`);

    return data.data;
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.DISTRICTS}/${id}`);
    return data.data;
  },
};
