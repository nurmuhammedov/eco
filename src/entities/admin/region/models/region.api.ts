import { ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { CreateRegionDTO, type FilterRegionDTO, RegionResponse, UpdateRegionDTO } from './region.types'

export const regionAPI = {
  fetchRegions: async (params: FilterRegionDTO) => {
    const { data } = await apiClient.getWithPagination<RegionResponse>(API_ENDPOINTS.REGIONS, params)
    return data || []
  },

  fetchRegion: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<RegionResponse>>(`${API_ENDPOINTS.REGIONS}/${id}`)
    return data.data
  },
  createRegion: async (district: CreateRegionDTO) => {
    // if (!response.success && response.errors) {
    //   toast.error(Object.values(response.errors).join(', '), {
    //     richColors: true,
    //   });
    // }

    return await apiClient.post<RegionResponse, CreateRegionDTO>(API_ENDPOINTS.REGIONS, district)
  },
  updateRegion: async (district: UpdateRegionDTO) => {
    const response = await apiClient.put<UpdateRegionDTO>(`${API_ENDPOINTS.REGIONS}/${district.id}`, district)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response
  },
  deleteRegion: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.REGIONS}/${id}`)
    if (!response.success) {
      throw new Error(response.message)
    }
  },
}
