import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import type {
  CreateTerritorialDepartmentsDTO,
  FilterTerritorialDepartmentsDTO,
  TerritorialDepartmentResponse,
  UpdateTerritorialDepartmentsDTO,
} from './territorial-departments.types';

export const territorialDepartmentsAPI = {
  list: async (params: FilterTerritorialDepartmentsDTO) => {
    const { data } =
      await apiClient.getWithPagination<TerritorialDepartmentResponse>(
        API_ENDPOINTS.OFFICES,
        params,
      );
    return data || [];
  },

  byId: async (id: number) => {
    const { data } = await apiClient.get<
      ApiResponse<TerritorialDepartmentResponse>
    >(`${API_ENDPOINTS.OFFICES}/${id}`);
    return data.data;
  },
  create: async (district: CreateTerritorialDepartmentsDTO) => {
    const response = await apiClient.post<
      TerritorialDepartmentResponse,
      CreateTerritorialDepartmentsDTO
    >(API_ENDPOINTS.OFFICES, district);
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }

    return response;
  },
  update: async (district: UpdateTerritorialDepartmentsDTO) => {
    const response = await apiClient.put<UpdateTerritorialDepartmentsDTO>(
      `${API_ENDPOINTS.OFFICES}/${district.id}`,
      district,
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.OFFICES}/${id}`);
    if (!response.success) {
      throw new Error(response.message);
    }
  },
};
