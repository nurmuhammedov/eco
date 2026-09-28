import { ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import type {
  CommitteeStaffPayload,
  CommitteeStaffResponse,
  CommitteeStaffTableItem,
  FilterCommitteeStaffDTO,
} from './committee-staffs.types'

export const committeeStaffAPI = {
  list: async (params: FilterCommitteeStaffDTO) => {
    const { data } = await apiClient.getWithPagination<CommitteeStaffTableItem>(API_ENDPOINTS.COMMITTEE_USERS, params)
    return data || []
  },

  byId: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<CommitteeStaffResponse>>(`${API_ENDPOINTS.USERS}/${id}`)
    return data.data
  },
  create: async (staff: CommitteeStaffPayload) => {
    return await apiClient.post<unknown, CommitteeStaffPayload>(API_ENDPOINTS.COMMITTEE_USERS, staff)
  },
  update: async ({ id, ...staff }: CommitteeStaffPayload & { id: string }) => {
    const response = await apiClient.put<unknown, CommitteeStaffPayload>(
      `${API_ENDPOINTS.COMMITTEE_USERS}/${id}`,
      staff
    )

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
