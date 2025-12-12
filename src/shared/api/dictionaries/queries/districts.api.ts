import { type ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'

export const districtsAPI = {
  list: async (regionId?: string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.DISTRICT_SELECT}`, { regionId })
    return data.data
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.DISTRICTS}/${id}`)
    return data.data
  },
}
