import { type QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from './endpoint-key'

/**
 * A create, update or delete on an admin dictionary. Those lists are small and
 * edited rarely, so once the server has answered the whole slice is refetched,
 * with any endpoint-keyed readers of the same data. Patching the cached lists
 * by hand used to leave the wrapped server answer in the detail cache, so the
 * next edit form opened with empty fields.
 */
export const useSliceMutation = <TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  sliceKey: QueryKey,
  endpoints: string[] = []
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: sliceKey }),
        ...endpoints.map((endpoint) => invalidateEndpoint(queryClient, endpoint)),
      ]),
  })
}
