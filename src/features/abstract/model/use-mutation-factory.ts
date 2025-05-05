import { BaseApi, BaseEntity, PaginationParams } from '@/entities/base';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

export function createAddHook<TEntity extends BaseEntity, TFilters extends object>(
  apiClient: BaseApi<TEntity, TFilters>,
  entityType: string,
) {
  return function useAddEntity() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: (newEntity: Omit<TEntity, 'id'>) => {
        return apiClient.create(newEntity);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [entityType, 'list'] });
      },
    });

    return {
      mutate: (newEntity: Omit<TEntity, 'id'>) => {
        return new Promise<TEntity>((resolve, reject) => {
          mutation.mutate(newEntity, {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          });
        });
      },
      isPending: mutation.isPending,
    };
  };
}

export function createEditHook<TEntity extends BaseEntity, TFilters extends object>(
  apiClient: BaseApi<TEntity, TFilters>,
  entityType: string,
) {
  return function useEditEntity() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, ...data }: TEntity & { id: number }) => {
        return apiClient.update(id, data as Partial<Omit<TEntity, 'id'>>);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [entityType, 'list'] });
        queryClient.invalidateQueries({ queryKey: [entityType, 'details', String(data.id)] });
      },
    });

    return {
      mutate: (data: { id: number } & Partial<Omit<TEntity, 'id'>>) => {
        return new Promise<TEntity>((resolve, reject) => {
          mutation.mutate(data as TEntity & { id: number }, {
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(error),
          });
        });
      },
      isPending: mutation.isPending,
    };
  };
}

export function createListHook<TEntity extends BaseEntity, TFilters extends object>(
  apiClient: BaseApi<TEntity, TFilters>,
  entityType: string,
) {
  return function useListEntity(
    params: PaginationParams & TFilters,
    options?: Omit<UseQueryOptions<TEntity[], Error, TEntity[], string[]>, 'queryKey' | 'queryFn'>,
  ) {
    return useQuery({
      queryKey: [entityType, 'list'],
      queryFn: async () => {
        const response = await apiClient.getAll(params);
        return response.content;
      },
      ...options,
    });
  };
}

export function createDetailHook<TEntity extends BaseEntity, TFilters extends object>(
  apiClient: BaseApi<TEntity, TFilters>,
  entityType: string,
) {
  return function useDetailEntity(
    id: number,
    options?: Omit<UseQueryOptions<TEntity, Error, TEntity, string[]>, 'queryKey' | 'queryFn'>,
  ) {
    return useQuery({
      enabled: !!id,
      queryKey: [entityType, 'detail', String(id)],
      queryFn: () => apiClient.getById(id),
      ...options,
    });
  };
}

export function createDeleteHook<TEntity extends BaseEntity, TFilters extends object>(
  apiClient: BaseApi<TEntity, TFilters>,
  entityType: string,
) {
  return function useDeleteEntity(options?: any) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => {
        return apiClient.delete(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [entityType, 'list'] });

        if (options?.onSuccess) {
          options.onSuccess();
        }
      },
      onError: (error: Error) => {
        // Trigger error callback
        if (options?.onError) {
          options.onError(error);
        }
      },
    });
  };
}
