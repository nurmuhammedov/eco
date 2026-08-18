import { servicesApiClient } from '@/shared/api/services-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type { QuestionPayload } from '../model/types'

export const createQuestion = async (data: QuestionPayload) => {
  return await servicesApiClient.post(SERVICES_API_ENDPOINTS.QUESTIONS, data)
}

export const updateQuestion = async ({ id, data }: { id: string; data: QuestionPayload }) => {
  return await servicesApiClient.put(SERVICES_API_ENDPOINTS.QUESTION_BY_ID(id), data)
}

export const deleteQuestion = async (id: string) => {
  return await servicesApiClient.delete(SERVICES_API_ENDPOINTS.QUESTION_BY_ID(id))
}
