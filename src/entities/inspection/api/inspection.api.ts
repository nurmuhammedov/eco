import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { ISearchParams } from '@/shared/types'

export const inspectionAPI = {
  getAll: async (params: ISearchParams) => {
    const { data } = await apiClient.getWithPagination(API_ENDPOINTS.INSPECTIONS, params)
    return data
  },
  getById: async (id: string) => {
    const { data } = await apiClient.get(`${API_ENDPOINTS.INSPECTIONS}/${id}`)
    return data
  },
}
