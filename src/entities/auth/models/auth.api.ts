import { LoginDTO } from './auth.types'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { UserState } from '@/entities/user'
import { ApiResponse } from '@/shared/types'

export const authAPI = {
  login: async (data: LoginDTO) => {
    const response = await apiClient.post<any, LoginDTO>(API_ENDPOINTS.LOGIN, data)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response.data.data
  },
  loginOneId: async (code: string) => {
    const response = await apiClient.post<any, any>(API_ENDPOINTS.LOGIN_ONE_ID, { code })

    if (!response.success) {
      throw new Error(response.message)
    }

    return response.data.data
  },
  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT)

    if (!response.success) {
      throw new Error(response.message)
    }
    return response.data
  },
  getMe: async () => {
    const response = await apiClient.get<ApiResponse<UserState>>(API_ENDPOINTS.USER_ME)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response.data.data
  },
}
