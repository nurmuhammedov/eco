import { DEFAULT_PAGE_SIZE, useFilters } from '@/shared';

export const useTableFilters = (namespace: string) => {
  return useFilters(namespace, { page: 1, pageSize: DEFAULT_PAGE_SIZE });
};
