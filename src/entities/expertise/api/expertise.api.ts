import { apiClient } from '@/shared/api/api-client'
import type { ConclusionPayload, OldConclusionPayload } from '../model/conclusion.types'

export const createExpertiseApplication = async (data: ConclusionPayload) => {
  const response = await apiClient.post<unknown, ConclusionPayload>('/conclusions', data)
  return response.data
}

export const createOldExpertiseApplication = async (data: OldConclusionPayload) => {
  const response = await apiClient.post<unknown, OldConclusionPayload>('/conclusions/old', data)
  return response.data
}
