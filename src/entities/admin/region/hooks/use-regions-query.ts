import { useQuery } from '@tanstack/react-query';
import { regionKeys } from '@/entities/admin/region';
import { regionAPI } from '@/entities/admin/region/region.api';

const DISTRICT_STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const useRegionsQuery = (filters: any) => {
  return useQuery({
    staleTime: DISTRICT_STALE_TIME,
    queryKey: regionKeys.list('region', filters),
    queryFn: () => regionAPI.fetchRegions(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useRegionQuery = (id: number) => {
  return useQuery({
    enabled: !!id,
    staleTime: DISTRICT_STALE_TIME,
    queryFn: () => regionAPI.fetchRegion(id),
    queryKey: regionKeys.detail('region', id),
    placeholderData: (previousData) => previousData,
  });
};
