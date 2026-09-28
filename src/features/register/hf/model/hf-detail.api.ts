import { apiClient } from '@/shared/api/api-client'
import type { HfDetail } from '@/entities/registry'
import type { ApiResponse } from '@/shared/types/api'

export const hfDetailApi = {
  getDetail: async (id?: string) => {
    const { data } = await apiClient.get<ApiResponse<HfDetail>>(`/hf/${id}`)
    return data.data
  },
}
