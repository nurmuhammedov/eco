import { axiosInstance } from './axios-instance';

type RequestParams = Record<string, any>;

export const apiClient = {
  get: async <T>(url: string, params?: RequestParams): Promise<T> => {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, body: any): Promise<T> => {
    const response = await axiosInstance.post<T>(url, body);
    return response.data;
  },

  put: async <T>(url: string, body: any): Promise<T> => {
    const response = await axiosInstance.put<T>(url, body);
    return response.data;
  },

  patch: async <T>(url: string, body: any): Promise<T> => {
    const response = await axiosInstance.patch<T>(url, body);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  },
};
