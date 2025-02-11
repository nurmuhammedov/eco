import { apiClient } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useGet = <T>(
  key: QueryKey,
  endpoint: keyof typeof API_ENDPOINTS,
  params: Record<string, string | number | boolean> = {}, // ✅ Default qiymat berildi
  options?: UseQueryOptions<T, unknown, T, QueryKey>,
) =>
  useQuery<T, unknown, T>({
    queryKey: [...key, params],
    queryFn: async () => {
      const response = await apiClient.get<T>(API_ENDPOINTS[endpoint], {
        params: params as any,
      });
      return response.data;
    },
    ...options,
  });

export const useGetById = <T>(
  id: number | string,
  endpoint: keyof typeof API_ENDPOINTS,
  options?: UseQueryOptions<T, unknown, T, QueryKey>,
) =>
  useQuery<T, unknown, T>({
    retry: false,
    enabled: !!id,
    queryKey: [endpoint, id],
    queryFn: async () => {
      const { data } = await apiClient.get<T>(
        `${API_ENDPOINTS[endpoint]}/${id}`,
      );
      return data;
    },
    ...options,
  });
