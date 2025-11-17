import { apiClient } from '@/shared/api/api-client';
import { HfoSelectOption, LegalInfo } from '../model/expertise.types';
import { ApiResponse } from '@/shared/types';

export const getLegalInfoByTin = async (tin: string): Promise<LegalInfo> => {
  const response = await apiClient.post<ApiResponse<LegalInfo>>(`/integration/iip/legal`, {
    tin,
  });
  return response.data?.data;
};

export const getHfoByTinSelect = async (tin?: string): Promise<HfoSelectOption[]> => {
  const response = await apiClient.get<ApiResponse<HfoSelectOption[]>>(`/hf/by-tin/select`, {
    legalTin: tin,
  });
  return response.data?.data;
};

export const createExpertiseApplication = async (data: any) => {
  const response = await apiClient.post('/conclusions', data);
  return response.data;
};
