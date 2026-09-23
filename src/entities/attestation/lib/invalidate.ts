import type { QueryClient } from '@tanstack/react-query'

/**
 * Scheduling moves an application between the queue, an exam and its detail
 * page at once, so every attestation view is refreshed together rather than
 * each mutation guessing which ones it touched.
 */
export const invalidateAttestation = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({
    predicate: ({ queryKey: [head, endpoint] }) =>
      (typeof head === 'string' && head.startsWith('attestation-')) ||
      (head === 'services' && typeof endpoint === 'string' && endpoint.startsWith('/attestation')),
  })
