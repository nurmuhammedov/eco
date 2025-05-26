import { apiClient } from '@/shared/api';
import { ISearchParams } from '@/shared/types';

export const applicationListApi = {
  getAll: async (params: ISearchParams) => {
    const { data } = await apiClient.getWithPagination('/appeals', params);
    return data;
  },
};
