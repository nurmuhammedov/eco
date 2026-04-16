import { ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { CreateParkDTO, FilterParkDTO, Park, UpdateParkDTO } from './park.types'

export const parkAPI = {
  fetchParks: async (params: FilterParkDTO) => {
    const { data } = await apiClient.getWithPagination<Park>(API_ENDPOINTS.PARKS, params)
    return data || []
  },

  fetchParksSelect: async (params: { regionId?: number | string | null; districtId?: number | string | null }) => {
    const { data } = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.PARKS_SELECT, {
      regionId: params.regionId || null,
      districtId: params.districtId || null,
    })
    return data.data
  },

  fetchPark: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Park>>(`${API_ENDPOINTS.PARKS}/${id}`)
    return data.data
  },

  createPark: async (park: CreateParkDTO) => {
    return await apiClient.post<Park, CreateParkDTO>(API_ENDPOINTS.PARKS, park)
  },

  updatePark: async (park: UpdateParkDTO) => {
    const response = await apiClient.put<UpdateParkDTO>(`${API_ENDPOINTS.PARKS}/${park.id}`, park)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response
  },

  deletePark: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.PARKS}/${id}`)
    if (!response.success) {
      throw new Error(response.message)
    }
  },
}
