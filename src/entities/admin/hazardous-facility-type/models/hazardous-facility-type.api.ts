import { ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS, apiClient } from '@/shared/api'
import {
  CreateHazardousFacilityTypeDTO,
  FilterHazardousFacilityTypeDTO,
  HazardousFacilityTypeResponse,
  UpdateHazardousFacilityTypeDTO,
} from './hazardous-facility-type.types.ts'

export const hazardousFacilityTypeAPI = {
  list: async (params: FilterHazardousFacilityTypeDTO) => {
    const { data } = await apiClient.getWithPagination<HazardousFacilityTypeResponse>(
      API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES,
      params
    )
    return data || []
  },

  byId: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<HazardousFacilityTypeResponse>>(
      `${API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES}/${id}`
    )
    return data.data
  },
  create: async (data: CreateHazardousFacilityTypeDTO) => {
    // if (!response.success && response.errors) {
    //   toast.error(Object.values(response.errors).join(', '), {
    //     richColors: true,
    //   });
    // }

    return await apiClient.post<HazardousFacilityTypeResponse, CreateHazardousFacilityTypeDTO>(
      API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES,
      data
    )
  },
  update: async (data: UpdateHazardousFacilityTypeDTO) => {
    const response = await apiClient.patch<UpdateHazardousFacilityTypeDTO>(
      `${API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES}/${data.id}`,
      data
    )

    if (!response.success) {
      throw new Error(response.message)
    }

    return response
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES}/${id}`)
    if (!response.success) {
      throw new Error(response.message)
    }
  },
}
