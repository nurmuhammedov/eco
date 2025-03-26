import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { districtAPI, districtKeys } from '@/entities/admin/districts';
import { DistrictResponse, FilterDistrictDTO } from '../models/district.types';

const DISTRICT_STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const useDistrictsQuery = (filters: FilterDistrictDTO) => {
  return useQuery({
    staleTime: DISTRICT_STALE_TIME,
    queryKey: districtKeys.list('district', filters),
    queryFn: () => districtAPI.fetchDistricts(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useDistrictQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<
      DistrictResponse,
      Error,
      DistrictResponse,
      ReturnType<typeof districtKeys.detail>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    enabled: !!id,
    staleTime: DISTRICT_STALE_TIME,
    queryFn: () => districtAPI.fetchDistrict(id),
    queryKey: districtKeys.detail('district', id),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useRegionSelectQuery = () => {
  return useQuery({
    staleTime: DISTRICT_STALE_TIME,
    queryFn: () => districtAPI.fetchRegionSelect(),
    queryKey: districtKeys.entity('district-region-select'),
  });
};
