import { apiClient } from '@/shared/api/api-client'
import type { XrayDetail } from '@/entities/registry'
import type { ApiResponse } from '@/shared/types/api'

export const xrayDetailApi = {
  getDetail: async (id?: string) => {
    const { data } = await apiClient.get<ApiResponse<XrayDetail>>(`/xrays/${id}`)
    return data.data
  },
}
