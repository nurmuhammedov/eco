import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '../../services';

export const useGet = <T>(
  key: string[],
  endpoint: string,
  params?: Record<string, any>,
  options?: UseQueryOptions<T, unknown, T, QueryKey>,
) =>
  useQuery<T, unknown, T>({
    queryKey: key,
    queryFn: () => apiClient.get<T>(endpoint, params).then((res) => res),
    ...options,
  });

export const useGetById = <T>(
  id: number,
  endpoint: string,
  options?: UseQueryOptions<T, unknown, T, QueryKey>,
) =>
  useQuery<T, unknown, T>({
    retry: false,
    enabled: !!id,
    queryKey: [id],
    queryFn: async () => await apiClient.get<T>(`${endpoint}/${id}`),
    ...options,
  });
