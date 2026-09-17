import { getTime } from '@/shared/lib/get-time'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { committeeStaffAPI } from '../models/committee-staffs.api'
import { committeeStaffKeys } from '../models/committee-staffs.query-keys'
import { CommitteeStaffResponse, FilterCommitteeStaffDTO } from '../models/committee-staffs.types'

export const useCommitteeStaffListQuery = (filters: FilterCommitteeStaffDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: committeeStaffKeys.list('committee-staff', filters),
    queryFn: () => committeeStaffAPI.list(filters),
    placeholderData: (previousData) => previousData,
  })
}

export const useCommitteeStaffQuery = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      CommitteeStaffResponse,
      Error,
      CommitteeStaffResponse,
      ReturnType<typeof committeeStaffKeys.detail>
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'day'),
    queryFn: () => committeeStaffAPI.byId(id),
    queryKey: committeeStaffKeys.detail('committee-staff', id),
    placeholderData: (previousData) => previousData,
    ...options,
  })
}
