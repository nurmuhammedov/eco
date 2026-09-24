import { type ApiResponse } from '@/shared/types/api'
import { type OptionItem } from '@/shared/types/general'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'

export const districtsAPI = {
  list: async (regionId?: string) => {
    const { data } = await apiClient.get<ApiResponse<OptionItem<number>[]>>(`${API_ENDPOINTS.DISTRICT_SELECT}`, {
      regionId,
    })
    return data.data
  },
}
