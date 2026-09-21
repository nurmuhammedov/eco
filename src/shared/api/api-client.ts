import { createApiClient } from './create-api-client'
import { axiosInstance } from './axios-instance'

export const apiClient = createApiClient(axiosInstance)
