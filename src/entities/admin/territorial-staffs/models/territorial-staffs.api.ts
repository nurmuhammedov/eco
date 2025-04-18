import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  CreateTerritorialStaffDTO,
  FilterTerritorialStaffDTO,
  TerritorialStaffResponse,
  UpdateTerritorialStaffDTO,
} from './territorial-staffs.types';

export const territorialStaffAPI = {
  list: async (params: FilterTerritorialStaffDTO) => {
    const { data } = await apiClient.getWithPagination<TerritorialStaffResponse>(API_ENDPOINTS.OFFICE_USERS, params);
    return data || [];
  },

  byId: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<TerritorialStaffResponse>>(`${API_ENDPOINTS.USERS}/${id}`);
    return data.data;
  },
  create: async (data: CreateTerritorialStaffDTO) => {
    const response = await apiClient.post<TerritorialStaffResponse, CreateTerritorialStaffDTO>(
      API_ENDPOINTS.OFFICE_USERS,
      data,
    );
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }

    return response;
  },
  update: async (data: UpdateTerritorialStaffDTO) => {
    const response = await apiClient.put<UpdateTerritorialStaffDTO>(`${API_ENDPOINTS.OFFICE_USERS}/${data.id}`, data);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`);
    if (!response.success) {
      throw new Error(response.message);
    }
  },
};
