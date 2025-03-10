import { createQueryKeys } from '@/shared/api/create-query-keys';

export const districtQueryKeys = {
  all: () => ['districts'],
  detail: (id: number) => [...districtQueryKeys.all(), 'detail', id],
  list: (params: unknown) => [...districtQueryKeys.all(), 'list', params],
};

export const districtKeys = createQueryKeys('district');
