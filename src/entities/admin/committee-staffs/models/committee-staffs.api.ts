import { ApiResponse } from '@/shared/types/api'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { CommitteeStaffResponse, type FilterCommitteeStaffDTO } from './committee-staffs.types'

import type { CreateCommitteeStaffDTO, UpdateCommitteeStaffDTO } from './committee-staffs.schema'

export const committeeStaffAPI = {
  list: async (params: FilterCommitteeStaffDTO) => {
    const { data } = await apiClient.getWithPagination<CommitteeStaffResponse>(API_ENDPOINTS.COMMITTEE_USERS, params)
    return data || []
  },

  byId: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<CommitteeStaffResponse>>(`${API_ENDPOINTS.USERS}/${id}`)
    return data.data
  },
  create: async (district: CreateCommitteeStaffDTO) => {
    // if (!response.success && response.errors) {
    //   toast.error(Object.values(response.errors).join(', '), {
    //     richColors: true,
    //   });
    // }

    return await apiClient.post<CommitteeStaffResponse, CreateCommitteeStaffDTO>(
      API_ENDPOINTS.COMMITTEE_USERS,
      district
    )
  },
  update: async (district: UpdateCommitteeStaffDTO) => {
    const response = await apiClient.put<UpdateCommitteeStaffDTO>(
      `${API_ENDPOINTS.COMMITTEE_USERS}/${district.id}`,
      district
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
