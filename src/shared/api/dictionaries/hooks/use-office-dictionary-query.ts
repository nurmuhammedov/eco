import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { officeAPI } from '@/shared/api/dictionaries/queries/office.api'

export const useOfficeSelectQuery = (enabled: boolean = true) =>
  useQuery({
    enabled,
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: endpointKey(API_ENDPOINTS.OFFICE_SELECT),
    queryFn: () => officeAPI.list(),
  })
