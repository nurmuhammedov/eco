import { AxiosError } from 'axios';
import { axiosInstance } from './axios-instance';
import { ApiResponse, ResponseData } from '@/shared/types/api';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type RequestParams = Record<string, string | number | boolean | object>;

async function apiRequest<T>(
  method: HttpMethod,
  url: string,
  payload?: RequestParams | object,
  usePagination: boolean = false,
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.request<T | ResponseData<T>>({
      method,
      url,
      ...(method === 'get' || method === 'delete'
        ? { params: payload as RequestParams }
        : { data: payload as object }),
    });

    return {
      success: true,
      status: response.status,
      data: usePagination
        ? (response.data as ResponseData<T>)
        : (response.data as T),
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      success: false,
      status: axiosError.response?.status || 500,
      errors: axiosError.response?.data?.message || 'An unknown error occurred',
    };
  }
}

export const apiClient = {
  get: <T>(url: string, params?: RequestParams) =>
    apiRequest<T>('get', url, params, false),

  getWithPagination: <T>(url: string, params?: RequestParams) =>
    apiRequest<T>('get', url, params, true),

  post: <T, B extends object>(url: string, body: B) =>
    apiRequest<T>('post', url, body, false),

  put: <T, B extends object>(url: string, body: B) =>
    apiRequest<T>('put', url, body, false),

  patch: <T, B extends object>(url: string, body: B) =>
    apiRequest<T>('patch', url, body, false),

  delete: <T>(url: string, params?: RequestParams) =>
    apiRequest<T>('delete', url, params, false),
};
