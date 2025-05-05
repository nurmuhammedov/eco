import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  CreateEquipmentDTO,
  EquipmentResponse,
  FilterEquipmentDTO,
  UpdateEquipmentDTO,
} from '@/entities/admin/equipment';

export const equipmentAPI = {
  getAll: async (params: FilterEquipmentDTO) => {
    const { data } = await apiClient.getWithPagination<EquipmentResponse>(API_ENDPOINTS.CHILD_EQUIPMENTS, params);
    return data || [];
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<EquipmentResponse>>(`${API_ENDPOINTS.CHILD_EQUIPMENTS}/${id}`);
    return data.data;
  },
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.REGIONS_SELECT}`);

    return data.data;
  },
  create: async (district: CreateEquipmentDTO) => {
    const response = await apiClient.post<EquipmentResponse, CreateEquipmentDTO>(
      API_ENDPOINTS.CHILD_EQUIPMENTS,
      district,
    );
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }

    return response;
  },
  update: async (district: UpdateEquipmentDTO) => {
    const response = await apiClient.put<UpdateEquipmentDTO>(
      `${API_ENDPOINTS.CHILD_EQUIPMENTS}/${district.id}`,
      district,
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.CHILD_EQUIPMENTS}/${id}`);
    if (!response.success) {
      throw new Error(response.message);
    }
  },
};
