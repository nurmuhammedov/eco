import { type ApiResponse } from '@/shared/types'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'

export const hazardousFacilityCategoryAPI = {
  // inMultiCategory narrows the list to the categories a facility may combine.
  list: async (inMultiCategory?: boolean) => {
    const { data } = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES_SELECT,
      inMultiCategory ? { inMultiCategory: true } : undefined
    )
    return data.data
  },
  detail: async (id: number | string) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES}/${id}`)
    return data.data
  },
}
