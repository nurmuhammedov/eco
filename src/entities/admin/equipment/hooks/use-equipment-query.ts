import { getTime } from '@/shared/lib/get-time'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { equipmentAPI } from '../models/equipment.api'
import { equipmentKeys } from '../models/equipment.query-keys'
import { EquipmentResponse, FilterEquipmentDTO } from '../models/equipment.types'

export const useEquipmentList = (params: FilterEquipmentDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: equipmentKeys.list('equipment', params),
    queryFn: () => equipmentAPI.getAll(params),
    placeholderData: (previousData) => previousData,
  })
}

export const useEquipmentDetail = (
  id: number,
  options?: Omit<
    UseQueryOptions<EquipmentResponse, Error, EquipmentResponse, ReturnType<typeof equipmentKeys.detail>>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'day'),
    queryFn: () => equipmentAPI.getById(id),
    queryKey: equipmentKeys.detail('equipment', id),
    placeholderData: (previousData) => previousData,
    ...options,
  })
}
