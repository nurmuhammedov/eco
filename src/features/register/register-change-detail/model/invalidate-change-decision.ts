import type { QueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'

/**
 * What confirming or returning a change request can leave stale. A confirmed
 * restore also puts the record back in the registry with a new registry file and
 * revives its preventions, so those are refetched too; for the other request
 * types the extra refetches are merely redundant.
 */
export const invalidateChangeDecision = (queryClient: QueryClient) => {
  void invalidateEndpoint(queryClient, '/changes/by-belong')
  void invalidateEndpoint(queryClient, '/change-logs')
  void invalidateEndpoint(queryClient, '/execution-processes/change')
  void invalidateRegistryQueries(queryClient)
  void invalidateEndpoint(queryClient, '/preventions')
  void invalidateEndpoint(queryClient, '/reports/prevention')
}
