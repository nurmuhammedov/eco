import { apiClient, API_ENDPOINTS } from '@/shared/api';
import { ApiResponse } from '@/shared/types/api';
import { CreateChecklistDTO, UpdateChecklistDTO, ChecklistResponse, FilterChecklistDTO } from './checklist.types';

export const inspectionChecklistAPI = {
  fetchChecklists: async (params: FilterChecklistDTO) => {
    const { data } = await apiClient.getWithPagination<ChecklistResponse>(API_ENDPOINTS.INSPECTION_CHECKLISTS, params);
    return data || [];
  },
  fetchChecklist: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<ChecklistResponse>>(
      `${API_ENDPOINTS.INSPECTION_CHECKLISTS}/${id}`,
    );
    return data.data;
  },
  fetchCategoryTypeSelect: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.INSPECTION_CATEGORY_TYPES}/select`);
    return data.data;
  },
  createChecklist: async (dto: CreateChecklistDTO) => {
    return await apiClient.post<ChecklistResponse, CreateChecklistDTO>(API_ENDPOINTS.INSPECTION_CHECKLISTS, dto);
  },
  updateChecklist: async (dto: UpdateChecklistDTO) => {
    const response = await apiClient.put<UpdateChecklistDTO>(`${API_ENDPOINTS.INSPECTION_CHECKLISTS}/${dto.id}`, dto);
    if (!response.success) throw new Error(response.message);
    return response;
  },
  deleteChecklist: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.INSPECTION_CHECKLISTS}/${id}`);
    if (!response.success) throw new Error(response.message);
  },
};
