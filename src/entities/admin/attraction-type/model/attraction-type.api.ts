import { apiClient } from '@/shared/api/api-client'
import { ApiResponse } from '@/shared/types'
import { AttractionTypeResponse, CreateAttractionTypeDTO, UpdateAttractionTypeDTO } from './attraction-type.types'

const API_ENDPOINT = '/child-equipment-sorts'

export const attractionTypeAPI = {
  getAll: (params: any) => apiClient.getWithPagination<AttractionTypeResponse>(API_ENDPOINT, params),
  getById: (id: number) =>
    apiClient.get<
      ApiResponse<{
        name: string
        childEquipmentId: string
      }>
    >(`${API_ENDPOINT}/${id}`),
  create: (data: CreateAttractionTypeDTO) => apiClient.post(API_ENDPOINT, data),
  update: (data: UpdateAttractionTypeDTO) => apiClient.put(`${API_ENDPOINT}/${data.id}`, data),
  delete: (id: number) => apiClient.delete(`${API_ENDPOINT}/${id}`),
  getAttractionsSelect: () =>
    apiClient.get<
      ApiResponse<
        {
          name: string
          id: string
        }[]
      >
    >('/child-equipments/select', { equipmentType: 'ATTRACTION' }),
}
