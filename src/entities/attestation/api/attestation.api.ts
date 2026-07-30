import { servicesApiClient } from '@/shared/api/services-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import {
  CreateDirectionPayload,
  CreateQuestionPayload,
  UpdateDirectionPayload,
  UpdateQuestionPayload,
} from '../model/types'

// Directions
export const createDirection = async (data: CreateDirectionPayload) => {
  return await servicesApiClient.post(SERVICES_API_ENDPOINTS.DIRECTIONS, data)
}

export const updateDirection = async ({ id, data }: { id: string; data: UpdateDirectionPayload }) => {
  return await servicesApiClient.put(SERVICES_API_ENDPOINTS.DIRECTION_BY_ID(id), data)
}

export const deleteDirection = async (id: string) => {
  return await servicesApiClient.delete(SERVICES_API_ENDPOINTS.DIRECTION_BY_ID(id))
}

// Questions
export const createQuestion = async (data: CreateQuestionPayload) => {
  return await servicesApiClient.post(SERVICES_API_ENDPOINTS.QUESTIONS, data)
}

export const updateQuestion = async ({ id, data }: { id: string; data: UpdateQuestionPayload }) => {
  return await servicesApiClient.put(SERVICES_API_ENDPOINTS.QUESTION_BY_ID(id), data)
}

export const deleteQuestion = async (id: string) => {
  return await servicesApiClient.delete(SERVICES_API_ENDPOINTS.QUESTION_BY_ID(id))
}
