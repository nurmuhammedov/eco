import { AxiosResponse } from 'axios';
import { apiClient } from '@/shared/api';
import { API_ENDPOINTS, ApiEndpoints } from '@/shared/api/endpoints';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

// Global error handling
const handleApiError = (err: unknown) => {
  console.error('API Error:', err);
};

// ✅ POST Request Hook
export const usePost = <T, V>(
  endpoint: ApiEndpoints,
  options?: UseMutationOptions<AxiosResponse<T>, unknown, V>,
) =>
  useMutation<AxiosResponse<T>, unknown, V>({
    mutationFn: async (data: V) => {
      try {
        return await apiClient.post<T, V>(API_ENDPOINTS[endpoint], data);
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    ...options,
  });

// ✅ PUT Request Hook
export const usePut = <T, V>(
  endpoint: ApiEndpoints,
  options?: UseMutationOptions<AxiosResponse<T>, unknown, V>,
) =>
  useMutation<AxiosResponse<T>, unknown, V>({
    mutationFn: async (data: V) => {
      try {
        return await apiClient.put<T, V>(API_ENDPOINTS[endpoint], data);
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    ...options,
  });

// ✅ PATCH Request Hook
export const usePatch = <T, V>(
  endpoint: ApiEndpoints,
  options?: UseMutationOptions<AxiosResponse<T>, unknown, V>,
) =>
  useMutation<AxiosResponse<T>, unknown, V>({
    mutationFn: async (data: V) => {
      try {
        return await apiClient.patch<T, V>(API_ENDPOINTS[endpoint], data);
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    ...options,
  });

// ✅ DELETE Request Hook
export const useDelete = <T>(
  endpoint: ApiEndpoints,
  options?: UseMutationOptions<AxiosResponse<T>, unknown, void>,
) =>
  useMutation<AxiosResponse<T>, unknown, void>({
    mutationFn: async () => {
      try {
        return await apiClient.delete<T>(API_ENDPOINTS[endpoint]);
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    ...options,
  });
