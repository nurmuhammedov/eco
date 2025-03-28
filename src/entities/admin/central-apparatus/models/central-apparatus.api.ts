import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  CentralApparatusResponse,
  CreateCentralApparatusDTO,
  type FilterCentralApparatusDTO,
  UpdateCentralApparatusDTO,
} from './central-apparatus.types';

export const centralApparatusAPI = {
  list: async (params: FilterCentralApparatusDTO) => {
    const { data } =
      await apiClient.getWithPagination<CentralApparatusResponse>(
        API_ENDPOINTS.DEPARTMENTS,
        params,
      );
    return data || [];
  },

  byId: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<CentralApparatusResponse>>(
      `${API_ENDPOINTS.DEPARTMENTS}/${id}`,
    );
    return data.data;
  },
  create: async (district: CreateCentralApparatusDTO) => {
    const response = await apiClient.post<
      CentralApparatusResponse,
      CreateCentralApparatusDTO
    >(API_ENDPOINTS.DEPARTMENTS, district);
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }

    return response;
  },
  update: async (district: UpdateCentralApparatusDTO) => {
    const response = await apiClient.put<UpdateCentralApparatusDTO>(
      `${API_ENDPOINTS.DEPARTMENTS}/${district.id}`,
      district,
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.DEPARTMENTS}/${id}`,
    );
    if (!response.success) {
      throw new Error(response.message);
    }
  },
};
