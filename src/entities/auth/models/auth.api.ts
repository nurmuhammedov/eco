import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { LoginDTO } from './auth.types';

export const authAPI = {
  login: async (data: LoginDTO) => {
    const response = await apiClient.post<any, LoginDTO>(
      API_ENDPOINTS.LOGIN,
      data,
    );

    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data.data;
  },
  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT);

    if (!response.success) {
      throw new Error(response.message);
    }

    console.log('logout response', response);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get<any>(API_ENDPOINTS.USER_ME);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response.data.data;
  },
};
