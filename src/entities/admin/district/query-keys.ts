export const districtQueryKeys = {
  all: () => ['districts'],
  detail: (id: number) => [...districtQueryKeys.all(), 'detail', id],
  list: (params: unknown) => [...districtQueryKeys.all(), 'list', params],
};
