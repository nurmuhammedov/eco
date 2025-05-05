import { apiClient } from '@/shared/api';
import type { BaseEntity, PaginationParams } from '@/entities/base';

export function createBaseApi<T extends BaseEntity, F extends Record<string, any>>(endpoint: string) {
  return {
    async getAll(params: PaginationParams & F) {
      const { data } = await apiClient.getWithPagination<T>(endpoint, { params });
      return data;
    },

    async getById(id: number): Promise<T> {
      const { data } = await apiClient.get<T>(`${endpoint}/${id}`);
      return data;
    },

    async create(entity: Omit<T, 'id'>): Promise<T> {
      const { data } = await apiClient.post<T>(endpoint, entity);
      return data;
    },

    async update(id: number, entity: Partial<Omit<T, 'id'>>): Promise<T> {
      const { data } = await apiClient.put<T>(`${endpoint}/${id}`, entity);
      return data;
    },

    async delete(id: number): Promise<void> {
      await apiClient.delete(`${endpoint}/${id}`);
    },
  };
}
