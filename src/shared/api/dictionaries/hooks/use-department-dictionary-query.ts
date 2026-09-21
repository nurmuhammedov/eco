import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { departmentsAPI } from '../queries/department.api'

export const useDepartmentSelectQuery = () =>
  useQuery({
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: endpointKey(API_ENDPOINTS.DEPARTMENT_SELECT),
    queryFn: () => departmentsAPI.list(),
  })
