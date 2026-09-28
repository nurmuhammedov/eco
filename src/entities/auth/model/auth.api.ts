import { LoginDTO } from './auth.types'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { apiClient } from '@/shared/api/api-client'
import { UserState } from '@/shared/types/user'
import { normalizeUser, type RawUser } from '@/shared/api/session'
import type { ApiResponse } from '@/shared/types/api'

export const authAPI = {
  login: async (data: LoginDTO): Promise<UserState> => {
    const response = await apiClient.post<ApiResponse<RawUser>, LoginDTO>(API_ENDPOINTS.LOGIN, data)

    if (!response.success) {
      throw new Error(response.message)
    }

    return normalizeUser(response.data.data)
  },
  loginOneId: async (code: string): Promise<UserState> => {
    const response = await apiClient.post<ApiResponse<RawUser>>(API_ENDPOINTS.LOGIN_ONE_ID, { code })

    if (!response.success) {
      throw new Error(response.message)
    }

    return normalizeUser(response.data.data)
  },
  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT)

    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data
  },
  switchOther: async (delegatorId: string) => {
    const response = await apiClient.post(`${API_ENDPOINTS.SWITCH_OTHER}?delegatorId=${delegatorId}`)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response.data
  },
  switchBack: async () => {
    const response = await apiClient.post(API_ENDPOINTS.SWITCH_BACK)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response.data
  },
}
