import { apiClient } from '@/shared/api';

export const applicationDetailApi = {
  get: async (id: string | number, params: any) => {
    const { data } = await apiClient.get(`/appeals/${id}`, params);
    return data;
  },
};
