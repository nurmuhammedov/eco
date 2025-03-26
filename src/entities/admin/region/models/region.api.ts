import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types/api.ts';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  CreateRegionDTO,
  type FilterRegionDTO,
  RegionResponse,
  UpdateRegionDTO,
} from './region.types.ts';

export const regionAPI = {
  fetchRegions: async (params: FilterRegionDTO) => {
    const { data } = await apiClient.getWithPagination<RegionResponse>(
      API_ENDPOINTS.REGIONS,
      params,
    );
    return data || [];
  },

  fetchRegion: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<RegionResponse>>(
      `${API_ENDPOINTS.REGIONS}/${id}`,
    );
    return data.data;
  },
  createRegion: async (district: CreateRegionDTO) => {
    const response = await apiClient.post<RegionResponse, CreateRegionDTO>(
      API_ENDPOINTS.REGIONS,
      district,
    );
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }

    return response;
  },
  updateRegion: async (district: UpdateRegionDTO) => {
    const response = await apiClient.put<UpdateRegionDTO>(
      `${API_ENDPOINTS.REGIONS}/${district.id}`,
      district,
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  deleteRegion: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.REGIONS}/${id}`);
    if (!response.success) {
      throw new Error(response.message);
    }
  },
};
