import { DICTIONARY_STALE_TIME } from '@/shared/lib/query/stale-time'
import { useQuery } from '@tanstack/react-query'
import { childEquipmentTypesAPI } from '@/shared/api/dictionaries'

export const useChildEquipmentTypes = (equipmentType?: string) => {
  return useQuery({
    enabled: !!equipmentType,
    queryKey: ['child equipment types', equipmentType],
    staleTime: DICTIONARY_STALE_TIME,
    queryFn: () => childEquipmentTypesAPI.list(equipmentType),
  })
}
