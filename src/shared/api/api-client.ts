import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { axiosInstance } from './axios-instance';
import type { ApiResponse, ResponseData } from '@/shared/types/api';

/**
 * Available HTTP methods
 */
type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

/**
 * Type for request parameters with proper typing
 */
type RequestParams = Record<
  string,
  string | number | boolean | null | undefined | object
>;

/**
 * Core API request function
 * @param method - HTTP method to use
 * @param url - Endpoint URL
 * @param payload - Request data (query params or body)
 * @param usePagination - Whether to expect paginated response
 */
/**
 * Core API request implementation
 */
async function apiRequest<T>(
  method: HttpMethod,
  url: string,
  payload?: RequestParams | object,
  usePagination?: boolean,
): Promise<ApiResponse<any>> {
  try {
    const requestConfig = {
      method,
      url,
      ...(method === 'get' || method === 'delete'
        ? { params: payload as RequestParams }
        : { data: payload as object }),
    };

    // Pagination uchun so'rov yuborish
    if (usePagination) {
      const response =
        await axiosInstance.request<ApiResponse<ResponseData<T>>>(
          requestConfig,
        );

      return {
        success: true,
        status: response.status,
        data: response.data.data,
      };
    } else {
      // Oddiy so'rov yuborish
      const response = await axiosInstance.request<T>(requestConfig);
      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    }
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string;
      errors?: Record<string, string>;
    }>;

    toast.error(axiosError.response?.data?.message, { richColors: true });

    return {
      data: null,
      success: false,
      status: axiosError.response?.status || 500,
      errors: axiosError.response?.data?.errors || {},
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        'An unknown error occurred',
    };
  }
}

/**
 * API Client with strongly typed methods
 */
export const apiClient = {
  get: <T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> =>
    apiRequest<T>('get', url, params),

  getWithPagination: <T>(
    url: string,
    params?: RequestParams,
  ): Promise<ApiResponse<ResponseData<T>>> =>
    apiRequest<T>('get', url, params, true),

  post: <T, B extends object = object>(
    url: string,
    body?: B,
  ): Promise<ApiResponse<T>> => apiRequest<T>('post', url, body),

  put: <T, B extends object = object>(
    url: string,
    body: B,
  ): Promise<ApiResponse<T>> => apiRequest<T>('put', url, body),

  patch: <T, B extends object = object>(
    url: string,
    body: B,
  ): Promise<ApiResponse<T>> => apiRequest<T>('patch', url, body),

  delete: <T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> =>
    apiRequest<T>('delete', url, params),
};
