import { getTime } from '@/shared/lib/get-time';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  committeeStaffAPI,
  committeeStaffKeys,
  CommitteeStaffResponse,
  FilterCommitteeStaffDTO,
} from '@/entities/admin/committee-staffs';

export const useCommitteeStaffListQuery = (
  filters: FilterCommitteeStaffDTO,
) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: committeeStaffKeys.list('committee-staff', filters),
    queryFn: () => committeeStaffAPI.list(filters),
    placeholderData: (previousData) => previousData,
  });
};

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
  >,
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'day'),
    queryFn: () => committeeStaffAPI.byId(id),
    queryKey: committeeStaffKeys.detail('committee-staff', id),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
