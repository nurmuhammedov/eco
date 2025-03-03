import { apiClient } from '@/shared/api';
import type { CreateUpdateDistrictDto, District } from './types';
import { ResponseData } from '@/shared/types/api.ts';

export const fetchDistricts = async (page: number, size: number) => {
  const { data } = await apiClient.getPaged<District>('/districts', {
    page,
    size,
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
