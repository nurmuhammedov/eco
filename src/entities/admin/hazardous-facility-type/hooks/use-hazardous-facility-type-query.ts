import { getTime } from '@/shared/lib';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  FilterHazardousFacilityTypeDTO,
  hazardousFacilityTypeAPI,
  hazardousFacilityTypeKeys,
  HazardousFacilityTypeResponse,
} from '@/entities/admin/hazardous-facility-type';

export const useHazardousFacilityTypeListQuery = (filters: FilterHazardousFacilityTypeDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: hazardousFacilityTypeKeys.list('hazardous-facility-type', filters),
    queryFn: () => hazardousFacilityTypeAPI.list(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useHazardousFacilityTypeQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<
      HazardousFacilityTypeResponse,
      Error,
      HazardousFacilityTypeResponse,
      ReturnType<typeof hazardousFacilityTypeKeys.detail>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'day'),
    queryFn: () => hazardousFacilityTypeAPI.byId(id),
    queryKey: hazardousFacilityTypeKeys.detail('hazardous-facility-type', id),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
