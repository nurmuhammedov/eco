import { apiClient } from '@/shared/api'

export const hfDetailApi = {
  getDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/hf/${id}`)
    return data.data
  },
}
