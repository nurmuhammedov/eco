import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { type FilterRegionDTO, type RegionResponse } from '../models/region.types'
import { regionAPI } from '../models/region.api'
import { regionKeys } from '../models/region.query-keys'

const DISTRICT_STALE_TIME = 10 * 60 * 1000 // 10 minutes

export const useRegionsQuery = (filters: FilterRegionDTO) => {
  return useQuery({
    staleTime: DISTRICT_STALE_TIME,
    queryKey: regionKeys.list('region', filters),
    queryFn: () => regionAPI.fetchRegions(filters),
    placeholderData: (previousData) => previousData,
  })
}

export const useRegionQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<RegionResponse, Error, RegionResponse, ReturnType<typeof regionKeys.detail>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    enabled: !!id,
    staleTime: DISTRICT_STALE_TIME,
    queryFn: () => regionAPI.fetchRegion(id),
    queryKey: regionKeys.detail('region', id),
    placeholderData: (previousData) => previousData,
    ...options,
  })
}
