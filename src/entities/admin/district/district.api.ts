import { apiClient } from '@/shared/api';
import { ResponseData } from '@/shared/types/api';
import {
  CreateDistrictDTO,
  District,
  UpdateDistrictDTO,
} from './district.types.ts';

export const districtAPI = {
  fetchDistricts: async <T extends Record<string, unknown>>(params: T) => {
    const { data } = await apiClient.getWithPagination<District>('/districts', {
      params,
    });
    return data || [];
  },
  fetchDistrict: async (id: number) => {
    const response = await apiClient.get<District>(`/districts/${id}`);
    if (!response.success) {
      throw new Error(response.errors);
    }

    return response.data;
  },
  createDistrict: async (district: CreateDistrictDTO) => {
    const response = await apiClient.post<District, CreateDistrictDTO>(
      '/districts',
      district,
    );
    if (!response.success) {
      throw new Error(response.errors as string);
    }

    return response.data;
  },
  updateDistrict: async (
    district: UpdateDistrictDTO,
  ): Promise<UpdateDistrictDTO> => {
    const response = await apiClient.put<UpdateDistrictDTO, UpdateDistrictDTO>(
      `districts/${district.id}`,
      district,
    );

    if (!response.success) {
      throw new Error(response.errors as string);
    }

    return response.data;
  },
  deleteDistrict: async (id: number) => {
    const response = await apiClient.delete(`/districts/${id}`);
    if (!response.success) {
      throw new Error(response.errors);
    }
  },
};
