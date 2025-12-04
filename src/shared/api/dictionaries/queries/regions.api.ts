import { type ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS, apiClient } from '@/shared/api'

export const regionsAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.REGIONS_SELECT}`)
    return data.data
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.REGIONS}/${id}`)
    return data.data
  },
}
