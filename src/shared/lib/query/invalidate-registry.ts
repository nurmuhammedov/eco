import { QueryClient } from '@tanstack/react-query'
import { QK_REGISTRY } from '@/shared/constants/query-keys'

/** Endpoints backing the registry list pages; see build-register-query.ts. */
const REGISTRY_ENDPOINTS = ['/hf', '/equipments', '/irs', '/xrays', '/tankers', '/radiation-profiles']

/**
 * Detail pages are keyed by QK_REGISTRY, but list pages are keyed by their endpoint
 * (see usePaginatedData). Invalidating only QK_REGISTRY left every list stale.
 */
export const invalidateRegistryQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({
    predicate: ({ queryKey }) => {
      const [root] = queryKey

      if (root === QK_REGISTRY) return true
      if (typeof root !== 'string') return false

      return REGISTRY_ENDPOINTS.some((base) => root === base || root.startsWith(`${base}/`))
    },
  })
