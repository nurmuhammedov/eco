import { apiClient } from '@/shared/api'

export const irsDetailApi = {
  getDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/irs/${id}`)
    return data.data
  },
}
