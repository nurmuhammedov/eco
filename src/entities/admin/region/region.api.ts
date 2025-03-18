import { apiClient } from '@/shared/api';
import { ResponseData } from '@/shared/types/api';
import { CreateRegionDTO, Region, UpdateRegionDTO } from './region.types.ts';

const REGION_API = '/region';

export const regionAPI = {
  fetchRegions: async <T extends Record<string, unknown>>(params: T) => {
    const { data } = await apiClient.getWithPagination<Region>(REGION_API, {
      params,
    });
    return (data as ResponseData<Region>) || [];
  },
  fetchRegion: async (id: number) => {
    const response = await apiClient.get<Region>(`${REGION_API}/${id}`);
    if (!response.success) {
      throw new Error(response.errors);
    }

    return response.data as Region;
  },
  createRegion: async (district: CreateRegionDTO) => {
    const response = await apiClient.post<Region, CreateRegionDTO>(
      REGION_API,
      district,
    );
    if (!response.success) {
      throw new Error(response.errors as string);
    }

    return response.data as Region;
  },
  updateRegion: async (district: UpdateRegionDTO): Promise<UpdateRegionDTO> => {
    const response = await apiClient.put<UpdateRegionDTO, UpdateRegionDTO>(
      `${REGION_API}/${district.id}`,
      district,
    );

    if (!response.success) {
      throw new Error(response.errors as string);
    }

    return response.data as UpdateRegionDTO;
  },
  deleteRegion: async (id: number) => {
    const response = await apiClient.delete(`/${REGION_API}/${id}`);
    if (!response.success) {
      throw new Error(response.errors);
    }
  },
};
