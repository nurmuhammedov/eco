import { ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import type {
  FilterTerritorialStaffDTO,
  TerritorialStaffPayload,
  TerritorialStaffResponse,
  TerritorialStaffTableItem,
} from './territorial-staffs.types'

export const territorialStaffAPI = {
  list: async (params: FilterTerritorialStaffDTO) => {
    const { data } = await apiClient.getWithPagination<TerritorialStaffTableItem>(API_ENDPOINTS.OFFICE_USERS, params)
    return data || []
  },

  byId: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<TerritorialStaffResponse>>(`${API_ENDPOINTS.USERS}/${id}`)
    return data.data
  },
  create: async (staff: TerritorialStaffPayload) => {
    return await apiClient.post<unknown, TerritorialStaffPayload>(API_ENDPOINTS.OFFICE_USERS, staff)
  },
  update: async ({ id, ...staff }: TerritorialStaffPayload & { id: string }) => {
    const response = await apiClient.put<unknown, TerritorialStaffPayload>(`${API_ENDPOINTS.OFFICE_USERS}/${id}`, staff)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`)
    if (!response.success) {
      throw new Error(response.message)
    }
  },
}
