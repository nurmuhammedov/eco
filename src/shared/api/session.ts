import { apiClient } from '@/shared/api/api-client'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { ApiResponse } from '@/shared/types'
import { UserRoles, UserState } from '@/shared/types/user'

export const SESSION_QUERY_KEY = ['me'] as const

type RawUser = Omit<UserState, 'role'> & { role: UserRoles | 'SUPERVISOR' | 'CONTROLLER' }

/**
 * The backend reports supervision and control as roles of their own, while the
 * interface treats them as the base role plus a flag - a supervisor still sees
 * everything a regional head sees.
 */
export const normalizeUser = (data: RawUser): UserState => {
  if (!data) return data

  if (data.role === 'SUPERVISOR') {
    return { ...data, role: UserRoles.REGIONAL, isSupervisor: true, isController: false }
  }

  if (data.role === 'CONTROLLER') {
    return { ...data, role: UserRoles.INSPECTOR, isSupervisor: false, isController: true }
  }

  return { ...data, role: data.role, isSupervisor: false, isController: false }
}

export const fetchCurrentUser = async (): Promise<UserState> => {
  const response = await apiClient.get<ApiResponse<RawUser>>(API_ENDPOINTS.USER_ME)

  if (!response.success) {
    throw new Error(response.message)
  }

  return normalizeUser(response.data.data)
}
