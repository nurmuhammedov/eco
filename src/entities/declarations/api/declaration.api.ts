import { apiClient } from '@/shared/api/api-client'
import { ApiResponse } from '@/shared/types'
import { CreateDeclarationFormValues } from '../model/declaration.types'

// Mock endpoint paths
const BASE_URL = '/declarations'

export const createDeclarationByExpert = async (data: CreateDeclarationFormValues) => {
  const payload = {
    customerTin: Number(data.customerTin),
    conclusionId: data.conclusionId,
    hfIds: data.hfIds,
    declarationPath: data.declarationPath,
    infoLetterPath: data.infoLetterPath,
    explanatoryNotePath: data.explanatoryNotePath,
  }
  const response = await apiClient.post(`${BASE_URL}/by-expert`, payload)
  return response.data
}

export const createDeclarationByLegal = async (data: CreateDeclarationFormValues) => {
  const payload = {
    expertId: data.expertId,
    conclusionId: data.conclusionId,
    hfIds: data.hfIds,
    declarationPath: data.declarationPath,
    infoLetterPath: data.infoLetterPath,
    explanatoryNotePath: data.explanatoryNotePath,
  }
  const response = await apiClient.post(`${BASE_URL}/by-legal`, payload)
  return response.data
}

export const confirmDeclaration = async (id: string) => {
  const response = await apiClient.post(`${BASE_URL}/${id}/confirm`)
  return response.data
}

export const rejectDeclaration = async (id: string, description: string) => {
  const response = await apiClient.post(`${BASE_URL}/${id}/reject`, { description })
  return response.data
}

export const cancelDeclaration = async (id: string, description: string) => {
  const response = await apiClient.post(`${BASE_URL}/${id}/cancel`, { description })
  return response.data
}

// Mock for getting expertise conclusions for select (as requested: "options api oqali stir bilan olib kelinadi")
export const getExpertiseConclusionsSelect = async (tin?: string) => {
  // Placeholder endpoint, assuming it might filter by TIN
  const response = await apiClient.get<ApiResponse<any[]>>('/conclusions/select', {
    params: { customerTin: tin },
  })
  return response.data?.data || []
}
