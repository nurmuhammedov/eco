import { apiClient } from '@/shared/api/api-client'
import { ApiResponse } from '@/shared/types'
import { CreateDeclarationFormValues } from '../model/declaration.types'

// Mock endpoint paths
const BASE_URL = '/declarations'

export const getDeclarations = async (params: any) => {
  const response = await apiClient.get<ApiResponse<any>>(BASE_URL, { params })
  return response.data
}

export const createDeclaration = async (data: CreateDeclarationFormValues) => {
  const response = await apiClient.post(BASE_URL, data)
  return response.data
}

// Mock for getting expertise conclusions for select (as requested: "options api oqali stir bilan olib kelinadi")
export const getExpertiseConclusionsSelect = async (tin?: string) => {
  // Placeholder endpoint, assuming it might filter by TIN
  const response = await apiClient.get<ApiResponse<any[]>>('/conclusions/select', {
    customerTin: tin,
  })
  return response.data?.data || []
}
export const getDeclarationById = async (id: string, params?: any) => {
  // Mock implementation - in real app should fetch from API
  // For now returning the same structure as we might expect
  const response = await apiClient.get<ApiResponse<any>>(`${BASE_URL}/${id}`, { params })
  return response.data
}
