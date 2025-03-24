import { apiClient } from '@/shared/api';
import { LoginDTO } from '@/entities/auth/models/auth.types';

export const authAPI = {
  login: async (data: LoginDTO) => {
    const response = await apiClient.post<any, LoginDTO>('/auth/login', data);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');

    if (!response.success) {
      throw new Error(response.message);
    }

    console.log('logout response', response);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get<any>('/users/me');

    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data.data;
  },
};
