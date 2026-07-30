import { getTime } from '@/shared/lib'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  FilterHazardousFacilityCategoryDTO,
  hazardousFacilityCategoryAPI,
  hazardousFacilityCategoryKeys,
  HazardousFacilityCategoryResponse,
} from '@/entities/admin/hazardous-facility-category'

export const useHazardousFacilityCategoryListQuery = (filters: FilterHazardousFacilityCategoryDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: hazardousFacilityCategoryKeys.list('hazardous-facility-category', filters),
    queryFn: () => hazardousFacilityCategoryAPI.list(filters),
    placeholderData: (previousData) => previousData,
  })
}

export const useHazardousFacilityCategoryQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<
      HazardousFacilityCategoryResponse,
      Error,
      HazardousFacilityCategoryResponse,
      ReturnType<typeof hazardousFacilityCategoryKeys.detail>
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'day'),
    queryFn: () => hazardousFacilityCategoryAPI.byId(id),
    queryKey: hazardousFacilityCategoryKeys.detail('hazardous-facility-category', id),
    placeholderData: (previousData) => previousData,
    ...options,
  })
}
