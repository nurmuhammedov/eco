import { type ApiResponse } from '@/shared/types/api'
import { type OptionItem } from '@/shared/types/general'
import { API_ENDPOINTS } from '../../endpoints'
import { apiClient } from '@/shared/api/api-client'

export const regionsAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<OptionItem<number>[]>>(`${API_ENDPOINTS.REGIONS_SELECT}`)
    return data.data
  },
}
