export const districtQueryKeys = {
  all: () => ['districts'],
  list: (params: { page: number; size: number }) => [
    ...districtQueryKeys.all(),
    'list',
    params,
  ],
  detail: (id: number) => [...districtQueryKeys.all(), 'detail', id],
};
