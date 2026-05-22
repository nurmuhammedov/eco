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
  postRecoveredAmount: async ({ id, data }: { id: string; data: { recoveredAmount: number } }) => {
    const { data: res } = await apiClient.post<any>(`/inquiries/${id}/accountant/recovered-amount`, data)
    return res.data
  },
  postPaidReward: async ({
    id,
    data,
  }: {
    id: string
    data: { paidRewardAmount: number; paymentExecutionFilePath: string }
  }) => {
    const { data: res } = await apiClient.post<any>(`/inquiries/${id}/accountant/paid-reward`, data)
    return res.data
  },
  postMibStatus: async ({ id, data }: { id: string; data: { isMib: boolean } }) => {
    const { data: res } = await apiClient.post<any>(`/inquiries/${id}/accountant/mib-status`, data)
    return res.data
  },
  postCompleteAccountant: async (id: string) => {
    const { data: res } = await apiClient.post<any>(`/inquiries/${id}/accountant/complete`)
    return res.data
  },
  deleteInquiry: async (id: string) => {
    const { data: res } = await apiClient.delete<any>(`/inquiries/${id}`)
    return res.data
  },
}
