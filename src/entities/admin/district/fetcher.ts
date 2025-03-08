import { apiClient } from '@/shared/api';
import type { CreateUpdateDistrictDto, District } from './types';
import { ResponseData } from '@/shared/types/api';

export const fetchDistricts = async <T extends Record<string, unknown>>(
  params: T,
) => {
  const { data } = await apiClient.getWithPagination<District>('/districts', {
    params,
  });
  return (data as ResponseData<District>) || [];
};

export const fetchDistrictById = async (id: number) => {
  const { data } = await apiClient.get<District>(`/districts/${id}`);
  return data as District;
};

export const createOrUpdateDistrict = (district: CreateUpdateDistrictDto) =>
  district.id
    ? apiClient.put<District, CreateUpdateDistrictDto>(
        `/districts/${district.id}`,
        district,
      )
    : apiClient.post<District, CreateUpdateDistrictDto>('/districts', district);

export const deleteDistrict = (id: number) =>
  apiClient.delete(`/districts/${id}`);
