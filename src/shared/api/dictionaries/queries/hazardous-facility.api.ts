import { type ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

export const hazardousFacilityAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.HAZARDOUS_FACILITY_SELECT}`);
    return data.data;
  },
};

export const useGetHazardousFacilitiesByTinQuery = (tin: string) =>
  useQuery({
    queryKey: ['hf-by-tin', tin],
    queryFn: () => apiClient.get(`/hf/by-tin/select`, { params: { tin } }),
    enabled: !!tin && tin.length === 9,
  });
