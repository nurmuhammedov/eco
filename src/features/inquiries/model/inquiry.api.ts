import { apiClient } from '@/shared/api/api-client'
import type { InquiryCourtExecution, InquiryInitialExecution } from './inquiry.types'

interface InquiryCommand<T> {
  id: string
  data: T
}

export const inquiryApi = {
  setInspector: async ({ id, data }: InquiryCommand<{ executorId: string }>) => {
    await apiClient.post<unknown>(`/inquiries/${id}/set-inspector`, data)
  },
  executeInitial: async ({ id, data }: InquiryCommand<InquiryInitialExecution>) => {
    await apiClient.post<unknown>(`/inquiries/${id}/execute-initial`, data)
  },
  executeCourt: async ({ id, data }: InquiryCommand<InquiryCourtExecution>) => {
    await apiClient.post<unknown>(`/inquiries/${id}/execute-court`, data)
  },
  postRecoveredAmount: async ({ id, data }: InquiryCommand<{ recoveredAmount: number }>) => {
    await apiClient.post<unknown>(`/inquiries/${id}/accountant/recovered-amount`, data)
  },
  postPaidReward: async ({
    id,
    data,
  }: InquiryCommand<{ paidRewardAmount: number; paymentExecutionFilePath: string }>) => {
    await apiClient.post<unknown>(`/inquiries/${id}/accountant/paid-reward`, data)
  },
  postMibStatus: async ({ id, data }: InquiryCommand<{ isMib: boolean }>) => {
    await apiClient.post<unknown>(`/inquiries/${id}/accountant/mib-status`, data)
  },
  postCompleteAccountant: async (id: string) => {
    await apiClient.post<unknown>(`/inquiries/${id}/accountant/complete`)
  },
  changeRegion: async ({ id, data }: InquiryCommand<{ regionId: number }>) => {
    await apiClient.patch<unknown>(`/inquiries/${id}/region`, data)
  },
}
