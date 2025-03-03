import { AxiosError } from 'axios';
import { axiosInstance } from './axios-instance';
import { ApiResponse, ResponseData } from '@/shared/types/api';

type RequestParams = Record<string, string | number | boolean | object>;

async function fetcher<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  paramsOrBody?: RequestParams | object,
  isPaginated: boolean = false,
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.request<T | ResponseData<T>>({
      method,
      url,
      ...(method === 'get' || method === 'delete'
        ? { params: paramsOrBody as RequestParams }
        : { data: paramsOrBody as object }),
    });

    return {
      success: true,
      status: response.status,
      data: isPaginated
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
    fetcher<T>('get', url, params, false),

  getPaged: <T>(url: string, params?: RequestParams) =>
    fetcher<T>('get', url, params, true),

  post: <T, B extends object>(url: string, body: B) =>
    fetcher<T>('post', url, body, false),

  put: <T, B extends object>(url: string, body: B) =>
    fetcher<T>('put', url, body, false),

  patch: <T, B extends object>(url: string, body: B) =>
    fetcher<T>('patch', url, body, false),

  delete: <T>(url: string, params?: RequestParams) =>
    fetcher<T>('delete', url, params, false),
};
