import { LoginDTO } from './auth.types';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

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
  loginOneId: async (code: string) => {
    const response = await apiClient.post<any, any>(
      API_ENDPOINTS.LOGIN_ONE_ID,
      { code },
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
