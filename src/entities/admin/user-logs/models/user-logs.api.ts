import { apiClient } from '@/shared/api/api-client'
import { FilterUserLogsDTO, UserLogsResponse } from '@/entities/admin/user-logs/models/user-logs.types'

const API_ENDPOINT = '/appeal-execution-processes'

export const userLogsAPI = {
  getAll: async (params: FilterUserLogsDTO) => {
    const { data } = await apiClient.getWithPagination<UserLogsResponse>(API_ENDPOINT, params)
    return data || []
  },
}
