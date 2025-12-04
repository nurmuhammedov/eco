// src/entities/admin/checklist-templates/models/checklist-templates.api.ts
import { API_ENDPOINTS, apiClient } from '@/shared/api'
import {
  ChecklistTemplate,
  CreateChecklistTemplateDTO,
  FilterChecklistTemplateDTO,
  UpdateChecklistTemplateDTO,
} from './checklist-templates.types'

export const checklistTemplateAPI = {
  getAll: (params?: FilterChecklistTemplateDTO) => {
    return apiClient.getWithPagination<ChecklistTemplate>(API_ENDPOINTS.CHECKLIST_TEMPLATES, params)
  },

  getById: (id: number) => {
    return apiClient.get<ChecklistTemplate>(`${API_ENDPOINTS.CHECKLIST_TEMPLATES}/${id}`)
  },

  create: async (data: CreateChecklistTemplateDTO) => {
    // if (!response.success && response.errors) {
    //   toast.error(Object.values(response.errors).join(', '), { richColors: true });
    // }
    return await apiClient.post<ChecklistTemplate, CreateChecklistTemplateDTO>(API_ENDPOINTS.CHECKLIST_TEMPLATES, data)
  },

  update: (data: UpdateChecklistTemplateDTO) => {
    return apiClient.patch<UpdateChecklistTemplateDTO>(`${API_ENDPOINTS.CHECKLIST_TEMPLATES}/${data.id}`, data)
  },

  delete: (id: number) => {
    return apiClient.delete(`${API_ENDPOINTS.CHECKLIST_TEMPLATES}/${id}`)
  },
}
