import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { districtsAPI } from '../queries/districts.api'

export const useDistrictSelectQuery = (regionId?: string | number) =>
  useQuery({
    enabled: !!regionId && regionId !== 'ALL',
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: endpointKey(API_ENDPOINTS.DISTRICT_SELECT, regionId),
    queryFn: () => districtsAPI.list(regionId === undefined ? undefined : String(regionId)),
  })
