import { apiClient } from '@/shared/api';
import { CreateRegionDTO, Region, UpdateRegionDTO } from './region.types';
import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types/api.ts';

const REGION_API = '/regions';

export const regionAPI = {
  fetchRegions: async <T extends Record<string, unknown>>(params: T) => {
    const { data } = await apiClient.getWithPagination<Region>(
      REGION_API,
      params as any,
    );
    return data || [];
  },

  fetchRegion: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Region>>(
      `${REGION_API}/${id}`,
    );
    return data.data;
  },
  createRegion: async (district: CreateRegionDTO) => {
    const response = await apiClient.post<Region, CreateRegionDTO>(
      REGION_API,
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
      `${REGION_API}/${district.id}`,
      district,
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  deleteRegion: async (id: number) => {
    const response = await apiClient.delete(`/${REGION_API}/${id}`);
    if (!response.success) {
      throw new Error(response.message);
    }
  },
};
