import { apiClient } from '@/shared/api/api-client'

export const inquiryApi = {
  setInspector: async ({ id, data }: { id: string; data: any }) => {
    const { data: res } = await apiClient.post<any>(`/inquiries/${id}/set-inspector`, data)
    return res.data
  },
  executeInitial: async ({ id, data }: { id: string; data: any }) => {
    const { data: res } = await apiClient.post<any>(`/inquiries/${id}/execute-initial`, data)
    return res.data
  },
  executeCourt: async ({ id, data }: { id: string; data: any }) => {
    const { data: res } = await apiClient.post<any>(`/inquiries/${id}/execute-court`, data)
    return res.data
  },
  executePayment: async ({ id, data }: { id: string; data: any }) => {
    const { data: res } = await apiClient.post<any>(`/inquiries/${id}/execute-payment`, data)
    return res.data
  },
  deleteInquiry: async (id: string) => {
    const { data: res } = await apiClient.delete<any>(`/inquiries/${id}`)
    return res.data
  },
}
