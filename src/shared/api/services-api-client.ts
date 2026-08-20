import type { ApiResponse, ResponseData } from '@/shared/types/api'
import { AxiosError, AxiosProgressEvent } from 'axios'
import { servicesAxiosInstance } from './services-axios-instance'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

type RequestParams = Record<string, string | number | boolean | null | undefined | object>

type RequestHeaders = Record<string, string>

type ProgressCallback = (progressEvent: AxiosProgressEvent) => void

async function servicesApiRequest<T>(
  method: HttpMethod,
  url: string,
  payload?: RequestParams | object,
  headers?: RequestHeaders,
  onUploadProgress?: ProgressCallback,
  usePagination?: boolean,
  downloadFile?: boolean
): Promise<ApiResponse<any>> {
  try {
    const requestConfig = {
      method,
      url: `/api/v1${url}`,
      headers,
      onUploadProgress,
      ...(method === 'get' || method === 'delete' ? { params: payload as RequestParams } : { data: payload as object }),
    }

    if (usePagination) {
      const response = await servicesAxiosInstance.request<ApiResponse<ResponseData<T>>>(requestConfig)

      return {
        success: true,
        status: response.status,
        data: response.data.data,
      }
    } else if (downloadFile) {
      const response = await servicesAxiosInstance.request<T>({
        ...requestConfig,
        responseType: 'blob',
      })

      return {
        success: true,
        status: response.status,
        data: response.data,
      }
    } else {
      const response = await servicesAxiosInstance.request<T>(requestConfig)
      return {
        success: true,
        status: response.status,
        data: response.data,
      }
    }
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string
      errors?: Record<string, string>
    }>

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw {
      data: null,
      success: false,
      status: axiosError.response?.status || 500,
      errors: axiosError.response?.data?.errors || {},
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Serverda nomaʼlum xatolik yuz berdi. Xatolik haqida xabar bering!',
    }
  }
}

export const servicesApiClient = {
  get: <T>(
    url: string,
    params?: RequestParams,
    headers?: RequestHeaders,
    onDownloadProgress?: ProgressCallback
  ): Promise<ApiResponse<T>> => servicesApiRequest<T>('get', url, params, headers, onDownloadProgress),

  getWithPagination: <T>(
    url: string,
    params?: RequestParams,
    headers?: RequestHeaders,
    onDownloadProgress?: ProgressCallback
  ): Promise<ApiResponse<ResponseData<T>>> =>
    servicesApiRequest<T>('get', url, params, headers, onDownloadProgress, true),

  downloadFile: <T>(
    url: string,
    params?: RequestParams,
    headers?: RequestHeaders,
    onDownloadProgress?: ProgressCallback
  ): Promise<ApiResponse<T>> => servicesApiRequest('get', url, params, headers, onDownloadProgress, false, true),

  post: <T, B extends object = object>(
    url: string,
    body?: B,
    headers?: RequestHeaders,
    onUploadProgress?: ProgressCallback
  ): Promise<ApiResponse<T>> => servicesApiRequest<T>('post', url, body, headers, onUploadProgress),

  put: <T, B extends object = object>(
    url: string,
    body: B,
    headers?: RequestHeaders,
    onUploadProgress?: ProgressCallback
  ): Promise<ApiResponse<T>> => servicesApiRequest<T>('put', url, body, headers, onUploadProgress),

  patch: <T, B extends object = object>(
    url: string,
    body: B,
    headers?: RequestHeaders,
    onUploadProgress?: ProgressCallback
  ): Promise<ApiResponse<T>> => servicesApiRequest<T>('patch', url, body, headers, onUploadProgress),

  delete: <T>(url: string, params?: RequestParams, headers?: RequestHeaders): Promise<ApiResponse<T>> =>
    servicesApiRequest<T>('delete', url, params, headers),
}
