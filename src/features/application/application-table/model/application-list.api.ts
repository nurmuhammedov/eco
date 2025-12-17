import { apiClient } from '@/shared/api/api-client'
import { ISearchParams } from '@/shared/types'

export const applicationListApi = {
  getAll: async (params: ISearchParams) => {
    const { data } = await apiClient.getWithPagination<any>('/appeals', params)
    return data
  },
}
