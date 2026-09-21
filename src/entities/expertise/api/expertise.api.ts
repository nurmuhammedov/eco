import { apiClient } from '@/shared/api/api-client'

export const createExpertiseApplication = async (data: any) => {
  const response = await apiClient.post('/conclusions', data)
  return response.data
}

export const createOldExpertiseApplication = async (data: any) => {
  const response = await apiClient.post('/conclusions/old', data)
  return response.data
}
