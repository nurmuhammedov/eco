import { getTime } from '@/shared/lib/get-time'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  FilterTerritorialStaffDTO,
  territorialStaffAPI,
  territorialStaffKeys,
  TerritorialStaffResponse,
} from '@/entities/admin/territorial-staffs'

export const useTerritorialStaffListQuery = (filters: FilterTerritorialStaffDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: territorialStaffKeys.list('territorial-staff', filters),
    queryFn: () => territorialStaffAPI.list(filters),
    placeholderData: (previousData) => previousData,
  })
}

export const useTerritorialStaffQuery = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      TerritorialStaffResponse,
      Error,
      TerritorialStaffResponse,
      ReturnType<typeof territorialStaffKeys.detail>
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'day'),
    queryFn: () => territorialStaffAPI.byId(id),
    queryKey: territorialStaffKeys.detail('territorial-staff', id),
    placeholderData: (previousData) => previousData,
    ...options,
  })
}
