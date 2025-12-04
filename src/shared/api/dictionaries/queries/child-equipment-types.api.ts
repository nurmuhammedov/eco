import { type ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS, apiClient } from '@/shared/api'

export const childEquipmentTypesAPI = {
  list: async (equipmentType?: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.CHILD_EQUIPMENTS_SELECT}`, {
      equipmentType,
    })
    return data.data
  },
}
