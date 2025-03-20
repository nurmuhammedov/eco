import { apiClient } from '@/shared/api';
import { LoginDTO } from '@/entities/auth/models/auth.types';

export const authAPI = {
  login: async (data: LoginDTO) => {
    const response = await apiClient.post<any, LoginDTO>('/auth/login', data);

    if (!response.success) {
      throw new Error(response.errors);
    }

    return response.data.data;
  },
  getMe: async () => {
    const response = await apiClient.get<any>('/users/me');

    if (!response.success) {
      throw new Error(response.errors);
    }

    return response.data.data;
  },
};
