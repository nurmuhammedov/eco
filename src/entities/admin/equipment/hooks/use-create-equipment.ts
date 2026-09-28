import { equipmentAPI } from '../model/equipment.api'
import { equipmentKeys } from '../model/equipment.query-keys'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useCreateEquipment = () =>
  useSliceMutation(equipmentAPI.create, equipmentKeys.root(), [API_ENDPOINTS.CHILD_EQUIPMENTS])
