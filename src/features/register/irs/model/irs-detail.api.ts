import { apiClient } from '@/shared/api/api-client'

export const irsDetailApi = {
  getDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/irs/${id}`)
    return data.data
  },
}
