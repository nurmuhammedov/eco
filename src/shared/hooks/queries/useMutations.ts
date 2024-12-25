import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../../services';

export const usePost = <T, V>(
  endpoint: string,
  options?: UseMutationOptions<T, unknown, V>,
) =>
  useMutation<T, unknown, V>({
    mutationFn: (data: V) => apiClient.post<T>(endpoint, data),
    onError: (err: any) => {
      console.log(err);
    },
    ...options,
  });

export const usePut = <T, V>(
  endpoint: string,
  options?: UseMutationOptions<T, unknown, V>,
) =>
  useMutation<T, unknown, V>({
    mutationFn: (data: V) => apiClient.put<T>(endpoint, data),
    ...options,
  });

export const usePatch = <T, V>(
  endpoint: string,
  options?: UseMutationOptions<T, unknown, V>,
) =>
  useMutation<T, unknown, V>({
    mutationFn: (data: V) => apiClient.patch<T>(endpoint, data),
    ...options,
  });

export const useDelete = <T>(
  endpoint: string,
  options?: UseMutationOptions<T, unknown, void>,
) =>
  useMutation<T, unknown, void>({
    mutationFn: () => apiClient.delete<T>(endpoint),
    ...options,
  });
