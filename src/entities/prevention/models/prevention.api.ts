import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types';
import { CreatePreventionDTO, Prevention, PreventionListResponse, PreventionType } from './prevention.types';

export const preventionAPI = {
  getAll: async (params: { isPassed: boolean; year?: number }) => {
    const response = await apiClient.getWithPagination<PreventionListResponse>(API_ENDPOINTS.PREVENTIONS, params);
    return response?.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.PREVENTIONS}/${id}`);
    return response?.data;
  },
  create: async (data: CreatePreventionDTO) => {
    const response = await apiClient.post<Prevention, CreatePreventionDTO>(API_ENDPOINTS.PREVENTIONS, data);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.PREVENTIONS}/${id}`);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  getTypes: async () => {
    const response = await apiClient.get<ApiResponse<PreventionType[]>>(`${API_ENDPOINTS.PREVENTIONS}/types`);
    return response?.data;
  },

  getPreventionFile: async (year: number) => {
    const response = await apiClient.get<ApiResponse<{ path: string }>>(`${API_ENDPOINTS.PREVENTIONS}/file/${year}`);
    return response?.data;
  },

  uploadPreventionFile: async (data: string) => {
    const response = await apiClient.post(`${API_ENDPOINTS.PREVENTIONS}/file`, { path: data } as unknown as object);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },

  deletePreventionFile: async (year: string | undefined) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.PREVENTIONS}/file`, { path: year });
    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
};
