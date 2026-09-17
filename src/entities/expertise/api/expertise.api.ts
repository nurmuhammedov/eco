import { apiClient } from '@/shared/api/api-client'
import { LegalInfo } from '../model/expertise.types'
import { ApiResponse } from '@/shared/types'

export const getLegalInfoByTin = async (tin: string): Promise<LegalInfo> => {
  const response = await apiClient.post<ApiResponse<LegalInfo>>(`/integration/iip/legal`, {
    tin,
  })
  return response.data?.data
}

export const createExpertiseApplication = async (data: any) => {
  const response = await apiClient.post('/conclusions', data)
  return response.data
}

export const createOldExpertiseApplication = async (data: any) => {
  const response = await apiClient.post('/conclusions/old', data)
  return response.data
}
