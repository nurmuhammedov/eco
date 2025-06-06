import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types/api';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  CommitteeStaffResponse,
  CreateCommitteeStaffDTO,
  type FilterCommitteeStaffDTO,
  UpdateCommitteeStaffDTO,
} from './committee-staffs.types';

export const committeeStaffAPI = {
  list: async (params: FilterCommitteeStaffDTO) => {
    const { data } = await apiClient.getWithPagination<CommitteeStaffResponse>(API_ENDPOINTS.COMMITTEE_USERS, params);
    return data || [];
  },

  byId: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<CommitteeStaffResponse>>(`${API_ENDPOINTS.USERS}/${id}`);
    return data.data;
  },
  create: async (district: CreateCommitteeStaffDTO) => {
    const response = await apiClient.post<CommitteeStaffResponse, CreateCommitteeStaffDTO>(
      API_ENDPOINTS.COMMITTEE_USERS,
      district,
    );
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }

    return response;
  },
  update: async (district: UpdateCommitteeStaffDTO) => {
    const response = await apiClient.put<UpdateCommitteeStaffDTO>(
      `${API_ENDPOINTS.COMMITTEE_USERS}/${district.id}`,
      district,
    );

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
