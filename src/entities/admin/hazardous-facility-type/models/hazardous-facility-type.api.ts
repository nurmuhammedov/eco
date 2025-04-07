import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  CreateHazardousFacilityTypeDTO,
  FilterHazardousFacilityTypeDTO,
  HazardousFacilityTypeResponse,
  UpdateHazardousFacilityTypeDTO,
} from './hazardous-facility-type.types.ts';

export const hazardousFacilityTypeAPI = {
  list: async (params: FilterHazardousFacilityTypeDTO) => {
    const { data } =
      await apiClient.getWithPagination<HazardousFacilityTypeResponse>(
        API_ENDPOINTS.REGIONS,
        params,
      );
    return data || [];
  },

  byId: async (id: number) => {
    const { data } = await apiClient.get<
      ApiResponse<HazardousFacilityTypeResponse>
    >(`${API_ENDPOINTS.REGIONS}/${id}`);
    return data.data;
  },
  create: async (data: CreateHazardousFacilityTypeDTO) => {
    const response = await apiClient.post<
      HazardousFacilityTypeResponse,
      CreateHazardousFacilityTypeDTO
    >(API_ENDPOINTS.REGIONS, data);
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }

    return response;
  },
  update: async (data: UpdateHazardousFacilityTypeDTO) => {
    const response = await apiClient.put<UpdateHazardousFacilityTypeDTO>(
      `${API_ENDPOINTS.REGIONS}/${data.id}`,
      data,
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.REGIONS}/${id}`);
    if (!response.success) {
      throw new Error(response.message);
    }
  },
};
