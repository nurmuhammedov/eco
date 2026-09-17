import { apiConfig } from '@/shared/api/constants'
import { createAxiosInstance } from './create-axios-instance'

export const servicesAxiosInstance = createAxiosInstance(apiConfig.servicesURL)
