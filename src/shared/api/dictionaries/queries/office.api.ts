import { ApiResponse } from '@/shared/types/api.ts';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

export const officeAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.OFFICE_SELECT}`);

    return data.data;
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.OFFICES}/${id}`);
    return data.data;
  },
};
