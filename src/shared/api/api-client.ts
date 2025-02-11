import { AxiosResponse } from 'axios';
import { axiosInstance } from './axios-instance';

type RequestParams = Record<string, string | number | boolean>;

export const apiClient = {
  // ✅ GET
  get: async <T>(
    url: string,
    params?: RequestParams,
  ): Promise<AxiosResponse<T>> => {
    return await axiosInstance.get<T>(url, { params }); // ✅ Return full `AxiosResponse`
  },

  // ✅ POST
  post: async <T, B>(url: string, body: B): Promise<AxiosResponse<T>> => {
    return await axiosInstance.post<T>(url, body);
  },

  // ✅ PUT
  put: async <T, B>(url: string, body: B): Promise<AxiosResponse<T>> => {
    return await axiosInstance.put<T>(url, body);
  },

  // ✅ PATCH
  patch: async <T, B>(url: string, body: B): Promise<AxiosResponse<T>> => {
    return await axiosInstance.patch<T>(url, body);
  },

  // ✅ DELETE
  delete: async <T>(
    url: string,
    params?: RequestParams,
  ): Promise<AxiosResponse<T>> => {
    return await axiosInstance.delete<T>(url, { params });
  },
};
