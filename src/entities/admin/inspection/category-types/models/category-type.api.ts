import { apiClient, API_ENDPOINTS } from '@/shared/api';
import { ApiResponse } from '@/shared/types/api';
import {
  CreateCategoryTypeDTO,
  UpdateCategoryTypeDTO,
  CategoryTypeResponse,
  FilterCategoryTypeDTO,
} from './category-type.types';

export const inspectionCategoryTypeAPI = {
  fetchCategoryTypes: async (params: FilterCategoryTypeDTO) => {
    const { data } = await apiClient.getWithPagination<CategoryTypeResponse>(
      API_ENDPOINTS.INSPECTION_CATEGORY_TYPES,
      params,
    );
    return data || [];
  },
  fetchCategoryType: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<CategoryTypeResponse>>(
      `${API_ENDPOINTS.INSPECTION_CATEGORY_TYPES}/${id}`,
    );
    return data.data;
  },
  fetchCategoryTypeSelect: async (params: any) => {
    const { data } = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.INSPECTION_CATEGORY_TYPES}/select`, params);
    return data.data;
  },
  fetchCategoryTypeMetaSelect: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>(`/metadata/checklist/inspection/categories`);
    return data.data;
  },
  createCategoryType: async (dto: CreateCategoryTypeDTO) => {
    return await apiClient.post<CategoryTypeResponse, CreateCategoryTypeDTO>(
      API_ENDPOINTS.INSPECTION_CATEGORY_TYPES,
      dto,
    );
  },
  updateCategoryType: async (dto: UpdateCategoryTypeDTO) => {
    const response = await apiClient.put<UpdateCategoryTypeDTO>(
      `${API_ENDPOINTS.INSPECTION_CATEGORY_TYPES}/${dto.id}`,
      dto,
    );
    if (!response.success) throw new Error(response.message);
    return response;
  },
  deleteCategoryType: async (id: number) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.INSPECTION_CATEGORY_TYPES}/${id}`);
    if (!response.success) throw new Error(response.message);
  },
};
