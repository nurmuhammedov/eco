import { toast } from 'sonner';
import { ApiResponse } from '@/shared/types';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  CreateApplicationDTO,
  FilterApplicationDTO,
  SingleApplicationResponse,
} from '@/entities/application';
import { applicationSchemas } from '@/entities/application/schema/application.schema';

export const applicationAPI = {
  list: async (params: FilterApplicationDTO) => {
    const validParams = applicationSchemas.filter.parse(params);
    const { data } =
      await apiClient.getWithPagination<SingleApplicationResponse>(
        API_ENDPOINTS.DEPARTMENTS,
        validParams,
      );
    return data || [];
  },
  byId: async (id: number) => {
    const { data } = await apiClient.get<
      ApiResponse<SingleApplicationResponse>
    >(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
    return data.data;
  },
  create: async (data: CreateApplicationDTO) => {
    const validData = applicationSchemas.create.parse(data);

    const response = await apiClient.post<
      SingleApplicationResponse,
      CreateApplicationDTO
    >(API_ENDPOINTS.DEPARTMENTS, validData);
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }

    return response;
  },
};
