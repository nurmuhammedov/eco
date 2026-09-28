import { apiClient } from '@/shared/api/api-client'
import type { IrsDetail } from '@/entities/registry'
import type { ApiResponse } from '@/shared/types/api'

export const irsDetailApi = {
  getDetail: async (id?: string) => {
    const { data } = await apiClient.get<ApiResponse<IrsDetail>>(`/irs/${id}`)
    return data.data
  },
}
