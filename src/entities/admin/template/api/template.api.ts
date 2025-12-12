import { ApiResponse, ResponseData } from '@/shared/types'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { Template, TemplateFormDTO } from '@/entities/admin/template'

export const templateAPI = {
  list: async (filters: any) => {
    const { data } = await apiClient.getWithPagination<ResponseData<Template>>(API_ENDPOINTS.TEMPLATES, filters)
    return data || []
  },
  byId: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Template>>(`${API_ENDPOINTS.TEMPLATES}/${id}`)
    return data.data
  },
  create: async (data: TemplateFormDTO) => {
    // if (!response.success && response.errors) {
    //   toast.error(Object.values(response.errors).join(', '), {
    //     richColors: true,
    //   });
    // }

    return await apiClient.post<Template, TemplateFormDTO>(API_ENDPOINTS.TEMPLATES, data)
  },
  updateData: async (id: number, templateData: Partial<TemplateFormDTO>) => {
    const response = await apiClient.put<Template>(`${API_ENDPOINTS.TEMPLATES}/${id}`, templateData)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response
  },
  updateContent: async (id: number, templateData: Partial<TemplateFormDTO>) => {
    const response = await apiClient.patch<Template>(`${API_ENDPOINTS.UPDATE_TEMPLATE_CONTENT}/${id}`, templateData)

    if (!response.success) {
      throw new Error(response.message)
    }

    return response
  },
}
