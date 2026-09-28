import { apiClient } from '@/shared/api/api-client'
import type { EquipmentDetail } from '@/entities/registry'
import type { ApiResponse } from '@/shared/types/api'

export const equipmentsDetailApi = {
  getDetail: async (id?: string) => {
    const { data } = await apiClient.get<ApiResponse<EquipmentDetail>>(`/equipments/${id}`)
    return data.data
  },
}
