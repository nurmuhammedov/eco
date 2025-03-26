import {
  type FilterRegionDTO,
  regionAPI,
  regionKeys,
  type RegionResponse,
} from '@/entities/admin/region';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const DISTRICT_STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const useRegionsQuery = (
  filters: FilterRegionDTO,
  options?: Omit<
    UseQueryOptions<
      RegionResponse[],
      Error,
      RegionResponse[],
      ReturnType<typeof regionKeys.list>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    staleTime: DISTRICT_STALE_TIME,
    queryKey: regionKeys.list('region', filters),
    queryFn: () => regionAPI.fetchRegions(filters),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useRegionQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<
      RegionResponse,
      Error,
      RegionResponse,
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
