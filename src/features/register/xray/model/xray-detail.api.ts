import { apiClient } from '@/shared/api/api-client'

export const xrayDetailApi = {
  getDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/xrays/${id}`)
    return data.data
  },
}
