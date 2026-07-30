import { type ApiResponse } from '@/shared/types'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'

export const hazardousFacilityCategoryAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES_SELECT}`)
    return data.data
  },
}
