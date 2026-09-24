import { type ApiResponse } from '@/shared/types'
import { type OptionItem } from '@/shared/types/general'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'

export const hazardousFacilityTypeAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<OptionItem<number>[]>>(
      `${API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES_SELECT}`
    )
    return data.data
  },
}
