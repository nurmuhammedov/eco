export const createQueryKeys = (slice: string) => {
  return {
    root: () => [slice] as const,
    entity: (entity: string) => [...createQueryKeys(slice).root(), entity] as const,
    list: <TFilters extends Record<string, unknown>>(entity: string, filters?: TFilters) =>
      filters
        ? ([...createQueryKeys(slice).entity(entity), 'list', filters] as const)
        : ([...createQueryKeys(slice).entity(entity), 'list'] as const),
    detail: (entity: string, id: string | number) => [...createQueryKeys(slice).entity(entity), 'detail', id] as const,
    operation: (entity: string, operation: string, params?: Record<string, unknown>) =>
      params
        ? ([...createQueryKeys(slice).entity(entity), operation, params] as const)
        : ([...createQueryKeys(slice).entity(entity), operation] as const),
  };
};
