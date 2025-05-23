import { apiClient } from '@/shared/api';

export const applicationListApi = {
  getAll: async (params: any) => {
    const { data } = await apiClient.getWithPagination('/appeals', params);
    return data;
  },
};
