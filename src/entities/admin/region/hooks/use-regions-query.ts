import { regionKeys } from '@/entities/admin/region';
import { Region } from '@/entities/admin/region/region.types';
import { regionAPI } from '@/entities/admin/region/region.api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const DISTRICT_STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const useRegionsQuery = (filters: any) => {
  return useQuery({
    staleTime: DISTRICT_STALE_TIME,
    queryKey: regionKeys.list('region', filters),
    queryFn: () => regionAPI.fetchRegions(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useRegionQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<
      Region,
      Error,
      Region,
      ReturnType<typeof regionKeys.detail>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    enabled: !!id,
    staleTime: DISTRICT_STALE_TIME,
    queryFn: () => regionAPI.fetchRegion(id),
    queryKey: regionKeys.detail('region', id),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
