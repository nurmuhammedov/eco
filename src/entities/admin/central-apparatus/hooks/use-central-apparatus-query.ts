import { getTime } from '@/shared/lib/get-time'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  centralApparatusAPI,
  centralApparatusKeys,
  CentralApparatusResponse,
  FilterCentralApparatusDTO,
} from '@/entities/admin/central-apparatus'

export const useCentralApparatusListQuery = (filters: FilterCentralApparatusDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: centralApparatusKeys.list('central-apparatus', filters),
    queryFn: () => centralApparatusAPI.list(filters),
    placeholderData: (previousData) => previousData,
  })
}

export const useCentralApparatusQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<
      CentralApparatusResponse,
      Error,
      CentralApparatusResponse,
      ReturnType<typeof centralApparatusKeys.detail>
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'week'),
    queryFn: () => centralApparatusAPI.byId(id),
    queryKey: centralApparatusKeys.detail('central-apparatus', id),
    placeholderData: (previousData) => previousData,
    ...options,
  })
}
