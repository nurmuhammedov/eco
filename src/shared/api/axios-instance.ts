import { apiConfig } from '@/shared/api/constants'
import { createAxiosInstance } from './create-axios-instance'

export const axiosInstance = createAxiosInstance(apiConfig.baseURL)
