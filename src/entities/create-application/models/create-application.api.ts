import {
  CreateCraneApplicationDTO,
  CreateHFApplicationDTO,
  CreateLiftApplicationDTO,
} from '@/entities/create-application'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { toast } from 'sonner'

export const createApplicationsAPI = {
  createHPOApplication: async (data: CreateHFApplicationDTO) => {
    return await apiClient.post<CreateHFApplicationDTO>(API_ENDPOINTS.APPEAL_HF, data)
  },
  createCraneApplication: async (data: CreateCraneApplicationDTO) => {
    return await apiClient.post<CreateCraneApplicationDTO>(API_ENDPOINTS.APPEAL_EQUIPMENT_CRANE, data)
  },
  createLiftApplication: async (data: CreateLiftApplicationDTO) => {
    const response = await apiClient.post<CreateLiftApplicationDTO>(API_ENDPOINTS.APPEAL_EQUIPMENT_ELEVATOR, data)
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      })
    }
    return response
  },
  createOilContainerApplication: async (data: any) => {
    const response = await apiClient.post<any>(API_ENDPOINTS.APPEAL_EQUIPMENT_OIL_CONTAINER, data)
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      })
    }
    return response
  },
  createIllegalOilContainerApplication: async (data: any) => {
    const response = await apiClient.post<any>(API_ENDPOINTS.APPEAL_EQUIPMENT_UNOFFICIAL_OIL_CONTAINER, data)
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      })
    }
    return response
  },
  generatePdfOilContainer: async (data: any) => {
    const response = await apiClient.post<any>(API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_OIL_CONTAINER, data)
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      })
    }
    return response
  },
  generatePdfIllegalOilContainer: async (data: any) => {
    const response = await apiClient.post<any>(API_ENDPOINTS.APPEAL_EQUIPMENT_PDF_UNOFFICIAL_OIL_CONTAINER, data)
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      })
    }
    return response
  },
}
