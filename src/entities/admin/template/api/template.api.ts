import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { Template, TemplateFormDTO } from '@/entities/admin/template';

export const templateAPI = {
  list: async () => {
    const { data } = await apiClient.getWithPagination<Template[]>(API_ENDPOINTS.TEMPLATES);
    return data.content || [];
  },
  byId: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Template>>(`${API_ENDPOINTS.TEMPLATES}/${id}`);
    return data.data;
  },
  create: async (data: TemplateFormDTO) => {
    const response = await apiClient.post<Template, TemplateFormDTO>(API_ENDPOINTS.TEMPLATES, data);
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }

    return response;
  },
  updateData: async (id: number, templateData: Partial<TemplateFormDTO>) => {
    const response = await apiClient.put<Template>(`${API_ENDPOINTS.TEMPLATES}/${id}`, templateData);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
  updateContent: async (id: number, templateData: Partial<TemplateFormDTO>) => {
    const response = await apiClient.patch<Template>(`${API_ENDPOINTS.UPDATE_TEMPLATE_CONTENT}/${id}`, templateData);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  },
};
