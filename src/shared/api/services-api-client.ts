import { createApiClient } from './create-api-client'
import { servicesAxiosInstance } from './services-axios-instance'

export const servicesApiClient = createApiClient(servicesAxiosInstance)
