import { apiClient } from '@/shared/api/api-client'
import type { ApplicationRow } from '@/entities/application'
import { ISearchParams } from '@/shared/types'

export const applicationListApi = {
  getAll: async (params: ISearchParams) => {
    const { data } = await apiClient.getWithPagination<ApplicationRow>('/appeals', params)
    return data
  },
}
