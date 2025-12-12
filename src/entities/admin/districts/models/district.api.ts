import { ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { CreateDistrictDTO, DistrictResponse, type FilterDistrictDTO, UpdateDistrictDTO } from './district.types'

export const districtAPI = {
  fetchDistricts: async (params: FilterDistrictDTO) => {
    const { data } = await apiClient.getWithPagination<DistrictResponse>(API_ENDPOINTS.DISTRICTS, params)
    return data || []
  },

  fetchDistrict: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<DistrictResponse>>(`${API_ENDPOINTS.DISTRICTS}/${id}`)
    return data.data
  },
  fetchRegionSelect: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.REGIONS_SELECT}`)

    return data.data
  },
  createDistrict: async (district: CreateDistrictDTO) => {
    // if (!response.success && response.errors) {
    //   toast.error(Object.values(response.errors).join(', '), {
    //     richColors: true,
    //   });
    // }

    return await apiClient.post<DistrictResponse, CreateDistrictDTO>(API_ENDPOINTS.DISTRICTS, district)
  },
  updateDistrict: async (district: UpdateDistrictDTO) => {
    const response = await apiClient.put<UpdateDistrictDTO>(`${API_ENDPOINTS.DISTRICTS}/${district.id}`, district)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response
  },
  deleteDistrict: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.DISTRICTS}/${id}`)
    if (!response.success) {
      throw new Error(response.message)
    }
  },
}
