import { apiClient } from '@/shared/api';
import type { ApiResponse, ResponseData } from '@/shared/types';

export const CommonService = {
  getPaginatedData: async <T>(endpoint: string, params = {}): Promise<ResponseData<T>> => {
    const response = await apiClient.getWithPagination<T>(endpoint, params);
    return response.data;
  },

  async addData<T extends object, TResponse>(endpoint: string, data: T): Promise<TResponse> {
    const response = await apiClient.post<TResponse, T>(endpoint, data);
    return response.data;
  },

  async updateData<T extends object, TResponse>(endpoint: string, data: T, id: string): Promise<TResponse> {
    const response = await apiClient.put<TResponse, T>(`${endpoint}/${id}`, data);
    return response.data;
  },

  async partialUpdateData<T extends object, TResponse>(endpoint: string, data: T, id: string): Promise<TResponse> {
    const response = await apiClient.patch<TResponse, T>(`${endpoint}/${id}`, data);
    return response.data;
  },

  async deleteData(endpoint: string, id: string | number): Promise<void> {
    const response = await apiClient.delete<any>(`${endpoint}/${id}`);
    return response.data;
  },

  async getDetail<T>(endpoint: string, id: string, params = {}): Promise<T> {
    const response = await apiClient.get<ApiResponse<T>>(`${endpoint}/${id}`, params);
    return response.data?.data;
  },

  async getData<T>(endpoint: string, params = {}): Promise<T> {
    const response = await apiClient.get<T>(endpoint, params);
    return response.data;
  },
};
