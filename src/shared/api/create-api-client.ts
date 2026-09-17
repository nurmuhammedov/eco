import type { AxiosError, AxiosInstance, AxiosProgressEvent } from 'axios'
import type { ApiResponse, ResponseData } from '@/shared/types/api'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type RequestParams = Record<string, string | number | boolean | null | undefined | object>

export type RequestHeaders = Record<string, string>

export type ProgressCallback = (progressEvent: AxiosProgressEvent) => void

/**
 * `paginated` unwraps the envelope the list endpoints add on top of the usual
 * one; `blob` asks axios for the raw file. Everything else is `plain`.
 */
type ResponseShape = 'plain' | 'paginated' | 'blob'

/**
 * One client per backend. They only differ in which axios instance they speak
 * through, so the request logic - method mapping, the envelope and the thrown
 * error shape - is written once here.
 */
export const createApiClient = (instance: AxiosInstance) => {
  async function request<TResult>(
    method: HttpMethod,
    url: string,
    payload?: RequestParams | object,
    headers?: RequestHeaders,
    onProgress?: ProgressCallback,
    shape: ResponseShape = 'plain'
  ): Promise<ApiResponse<TResult>> {
    try {
      const config = {
        method,
        url: `/api/v1${url}`,
        headers,
        onUploadProgress: onProgress,
        ...(method === 'get' || method === 'delete'
          ? { params: payload as RequestParams }
          : { data: payload as object }),
      }

      if (shape === 'paginated') {
        const response = await instance.request<ApiResponse<TResult>>(config)

        return { success: true, status: response.status, data: response.data.data }
      }

      const response = await instance.request<TResult>(shape === 'blob' ? { ...config, responseType: 'blob' } : config)

      return { success: true, status: response.status, data: response.data }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string> }>

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

  return {
    get: <T>(url: string, params?: RequestParams, headers?: RequestHeaders, onProgress?: ProgressCallback) =>
      request<T>('get', url, params, headers, onProgress),

    getWithPagination: <T>(
      url: string,
      params?: RequestParams,
      headers?: RequestHeaders,
      onProgress?: ProgressCallback
    ) => request<ResponseData<T>>('get', url, params, headers, onProgress, 'paginated'),

    downloadFile: <T>(url: string, params?: RequestParams, headers?: RequestHeaders, onProgress?: ProgressCallback) =>
      request<T>('get', url, params, headers, onProgress, 'blob'),

    post: <T, B extends object = object>(
      url: string,
      body?: B,
      headers?: RequestHeaders,
      onProgress?: ProgressCallback
    ) => request<T>('post', url, body, headers, onProgress),

    put: <T, B extends object = object>(
      url: string,
      body: B,
      headers?: RequestHeaders,
      onProgress?: ProgressCallback
    ) => request<T>('put', url, body, headers, onProgress),

    patch: <T, B extends object = object>(
      url: string,
      body: B,
      headers?: RequestHeaders,
      onProgress?: ProgressCallback
    ) => request<T>('patch', url, body, headers, onProgress),

    delete: <T>(url: string, params?: RequestParams, headers?: RequestHeaders) =>
      request<T>('delete', url, params, headers),
  }
}
