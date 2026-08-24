import { ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import {
  CreateHazardousFacilityCategoryDTO,
  FilterHazardousFacilityCategoryDTO,
  HazardousFacilityCategoryResponse,
  UpdateHazardousFacilityCategoryDTO,
} from './hazardous-facility-category.types.ts'

export const hazardousFacilityCategoryAPI = {
  list: async (params: FilterHazardousFacilityCategoryDTO) => {
    const { data } = await apiClient.getWithPagination<HazardousFacilityCategoryResponse>(
      API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES,
      params
    )
    return data || []
  },

  byId: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<HazardousFacilityCategoryResponse>>(
      `${API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES}/${id}`
    )
    return data.data
  },
  create: async (data: CreateHazardousFacilityCategoryDTO) => {
    return await apiClient.post<HazardousFacilityCategoryResponse, CreateHazardousFacilityCategoryDTO>(
      API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES,
      data
    )
  },
  update: async (data: UpdateHazardousFacilityCategoryDTO) => {
    const response = await apiClient.patch<UpdateHazardousFacilityCategoryDTO>(
      `${API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES}/${data.id}`,
      data
    )

    if (!response.success) {
      throw new Error(response.message)
    }

    return response
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.HAZARDOUS_FACILITY_CATEGORIES}/${id}`)
    if (!response.success) {
      throw new Error(response.message)
    }
  },
}
