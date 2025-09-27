import { getTime } from '@/shared/lib/get-time';
import { useQuery } from '@tanstack/react-query';
import { FilterUserLogsDTO, userLogsAPI, userLogsKeys } from '@/entities/admin/user-logs';

export const useUserLogsList = (params: FilterUserLogsDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: userLogsKeys.list('user-logs', params),
    queryFn: () => userLogsAPI.getAll(params),
    placeholderData: (previousData) => previousData,
  });
};
