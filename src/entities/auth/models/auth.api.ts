import { LoginDTO } from './auth.types'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { UserState, UserRoles } from '@/entities/user'
import { ApiResponse } from '@/shared/types'

const normalizeUser = (data: any): UserState => {
  if (!data) return data

  // Handle direct user object (like in getMe)
  if (data.role === 'SUPERVISOR') {
    data.role = UserRoles.REGIONAL
    data.isSupervisor = true
  } else if (data.role === 'CONTROLLER') {
    data.role = UserRoles.INSPECTOR
    data.isSupervisor = false
  } else {
    data.isSupervisor = false
  }

  // Handle object with user property (like potentially in login)
  if (data.user && typeof data.user === 'object') {
    if (data.user.role === 'SUPERVISOR') {
      data.user.role = UserRoles.REGIONAL
      data.user.isSupervisor = true
    } else if (data.user.role === 'CONTROLLER') {
      data.user.role = UserRoles.INSPECTOR
      data.user.isSupervisor = false
    } else {
      data.user.isSupervisor = false
    }
  }

  return data as UserState
}

export const authAPI = {
  login: async (data: LoginDTO): Promise<UserState> => {
    const response = await apiClient.post<any, LoginDTO>(API_ENDPOINTS.LOGIN, data)

    if (!response.success) {
      throw new Error(response.message)
    }

    return normalizeUser(response.data.data)
  },
  loginOneId: async (code: string): Promise<UserState> => {
    const response = await apiClient.post<any, any>(API_ENDPOINTS.LOGIN_ONE_ID, { code })

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
  getMe: async (): Promise<UserState> => {
    const response = await apiClient.get<ApiResponse<UserState>>(API_ENDPOINTS.USER_ME)

    if (!response.success) {
      throw new Error(response.message)
    }

    return normalizeUser(response.data.data)
  },
}
