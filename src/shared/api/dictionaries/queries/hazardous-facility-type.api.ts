import { type ApiResponse } from '@/shared/types';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

export const hazardousFacilityTypeAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES_SELECT}`);
    return data.data;
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES}/${id}`);
    return data.data;
  },
};
