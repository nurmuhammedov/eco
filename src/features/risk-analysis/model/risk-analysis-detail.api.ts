import { apiClient } from '@/shared/api/api-client'
import type { ApiResponse } from '@/shared/types/api'
import type { EquipmentDetail, HfDetail } from '@/entities/registry'

export const riskAnalysisDetailApi = {
  getObjectInfo: async ({ endpoint, id }: { endpoint: string; id: string }) => {
    const { data } = await apiClient.get<ApiResponse<HfDetail | EquipmentDetail>>(`${endpoint}/${id}`)
    return data.data
  },
}
