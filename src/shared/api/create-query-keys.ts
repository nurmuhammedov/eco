import { QueryKey } from '@tanstack/react-query';

export const createQueryKeys = (slice: string) => {
  return {
    // Base key for the slice
    root: () => [slice] as const,

    // Entity keys (can be a model or sub-feature)
    entity: (entity: string) =>
      [...createQueryKeys(slice).root(), entity] as const,

    // List with optional filters
    list: <TFilters extends Record<string, unknown>>(
      entity: string,
      filters?: TFilters,
    ): QueryKey =>
      filters
        ? ([...createQueryKeys(slice).entity(entity), 'list', filters] as const)
        : ([...createQueryKeys(slice).entity(entity), 'list'] as const),

    // Detail by ID
    detail: (entity: string, id: string | number): QueryKey =>
      [
        ...createQueryKeys(slice).entity(entity),
        'detail',
        id.toString(),
      ] as const,

    // Custom operations
    operation: (
      entity: string,
      operation: string,
      params?: Record<string, unknown>,
    ): QueryKey =>
      params
        ? ([
            ...createQueryKeys(slice).entity(entity),
            operation,
            params,
          ] as const)
        : ([...createQueryKeys(slice).entity(entity), operation] as const),
  };
};
