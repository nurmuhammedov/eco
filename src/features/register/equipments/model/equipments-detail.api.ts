import { apiClient } from '@/shared/api/api-client'

export const equipmentsDetailApi = {
  getDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/equipments/${id}`)
    return data.data
  },
}
