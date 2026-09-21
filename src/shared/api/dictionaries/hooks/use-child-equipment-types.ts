import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { childEquipmentTypesAPI } from '../queries/child-equipment-types.api'

export const useChildEquipmentTypes = (equipmentType?: string) =>
  useQuery({
    enabled: !!equipmentType,
    staleTime: DICTIONARY_STALE_TIME,
    queryKey: endpointKey(API_ENDPOINTS.CHILD_EQUIPMENTS_SELECT, equipmentType),
    queryFn: () => childEquipmentTypesAPI.list(equipmentType),
  })
