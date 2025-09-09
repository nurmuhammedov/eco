import type { ApiResponse, ResponseData } from '@/shared/types/api';
import { AxiosError, AxiosProgressEvent } from 'axios';
import { toast } from 'sonner';
import { axiosInstance } from './axios-instance';

/**
 * Available HTTP methods
 */
type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

/**
 * Type for request parameters with proper typing
 */
type RequestParams = Record<string, string | number | boolean | null | undefined | object>;

/**
 * Type for request headers
 */
type RequestHeaders = Record<string, string>;

/**
 * Progress callback type
 */
type ProgressCallback = (progressEvent: AxiosProgressEvent) => void;

/**
 * Core api request function
 * @param method - HTTP method to use
 * @param url - Endpoint URL
 * @param payload - Request data (query params or body)
 * @param headers - Custom headers to include in the request
 * @param onUploadProgress - Upload progress callback
 * @param usePagination - Whether to expect paginated response
 */
async function apiRequest<T>(
  method: HttpMethod,
  url: string,
  payload?: RequestParams | object,
  headers?: RequestHeaders,
  onUploadProgress?: ProgressCallback,
  usePagination?: boolean,
  downloadFile?: boolean,
): Promise<ApiResponse<any>> {
  try {
    const requestConfig = {
      method,
      url: `/api/v1${url}`,
      headers,
      onUploadProgress, // Axios konfiguratsiyasining asosiy parametri sifatida
      ...(method === 'get' || method === 'delete' ? { params: payload as RequestParams } : { data: payload as object }),
    };

    // Pagination uchun so'rov yuborish
    if (usePagination) {
      const response = await axiosInstance.request<ApiResponse<ResponseData<T>>>(requestConfig);

      return {
        success: true,
        status: response.status,
        data: response.data.data,
      };
    } else if (downloadFile) {
      const response = await axiosInstance.request<T>({
        ...requestConfig,
        responseType: 'blob',
      });

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } else {
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

    if (axiosError.response?.data?.message) {
      toast.error(axiosError.response?.data?.message, { richColors: true });
    }

    if (axiosError?.response?.status === 401) {
      toast.error("Avtorizatsiyadan o'tmagan", { richColors: true });
    }

    return {
      data: null,
      success: false,
      status: axiosError.response?.status || 500,
      errors: axiosError.response?.data?.errors || {},
      message: axiosError.response?.data?.message || axiosError.message || 'An unknown error occurred',
    };
  }
}

/**
 * api Client with strongly typed methods
 */
export const apiClient = {
  get: <T>(
    url: string,
    params?: RequestParams,
    headers?: RequestHeaders,
    onDownloadProgress?: ProgressCallback,
  ): Promise<ApiResponse<T>> => apiRequest<T>('get', url, params, headers, onDownloadProgress),

  getWithPagination: <T>(
    url: string,
    params?: RequestParams,
    headers?: RequestHeaders,
    onDownloadProgress?: ProgressCallback,
  ): Promise<ApiResponse<ResponseData<T>>> => apiRequest<T>('get', url, params, headers, onDownloadProgress, true),

  downloadFile: <T>(
    url: string,
    params?: RequestParams,
    headers?: RequestHeaders,
    onDownloadProgress?: ProgressCallback,
  ): Promise<ApiResponse<T>> => apiRequest('get', url, params, headers, onDownloadProgress, false, true),

  post: <T, B extends object = object>(
    url: string,
    body?: B,
    headers?: RequestHeaders,
    onUploadProgress?: ProgressCallback,
  ): Promise<ApiResponse<T>> => apiRequest<T>('post', url, body, headers, onUploadProgress),

  put: <T, B extends object = object>(
    url: string,
    body: B,
    headers?: RequestHeaders,
    onUploadProgress?: ProgressCallback,
  ): Promise<ApiResponse<T>> => apiRequest<T>('put', url, body, headers, onUploadProgress),

  patch: <T, B extends object = object>(
    url: string,
    body: B,
    headers?: RequestHeaders,
    onUploadProgress?: ProgressCallback,
  ): Promise<ApiResponse<T>> => apiRequest<T>('patch', url, body, headers, onUploadProgress),

  delete: <T>(url: string, params?: RequestParams, headers?: RequestHeaders, body?: any): Promise<ApiResponse<T>> =>
    apiRequest<T>('delete', url, params, headers, body),
};
