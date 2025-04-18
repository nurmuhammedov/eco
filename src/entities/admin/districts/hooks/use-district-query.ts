import { getTime } from '@/shared/lib/get-time';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { districtAPI, districtKeys } from '@/entities/admin/districts';
import { DistrictResponse, FilterDistrictDTO } from '../models/district.types';

export const useDistrictsQuery = (filters: FilterDistrictDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: districtKeys.list('district', filters),
    queryFn: () => districtAPI.fetchDistricts(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useDistrictQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<DistrictResponse, Error, DistrictResponse, ReturnType<typeof districtKeys.detail>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'day'),
    queryFn: () => districtAPI.fetchDistrict(id),
    queryKey: districtKeys.detail('district', id),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useRegionSelectQuery = () => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryFn: () => districtAPI.fetchRegionSelect(),
    queryKey: districtKeys.entity('district-region-select'),
  });
};
