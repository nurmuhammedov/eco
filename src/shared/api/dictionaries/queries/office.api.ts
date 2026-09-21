import { ApiResponse } from '@/shared/types/api'
import { type OptionItem } from '@/shared/types/general'
import { API_ENDPOINTS } from '../../endpoints'
import { apiClient } from '@/shared/api/api-client'

export const officeAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<OptionItem<number>[]>>(`${API_ENDPOINTS.OFFICE_SELECT}`)

    return data.data
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.OFFICES}/${id}`)
    return data.data
  },
}
