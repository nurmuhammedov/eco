import type { QueryClient, QueryKey } from '@tanstack/react-query'

/**
 * Every generic hook keys its cache by the endpoint it reads, so a mutation can
 * find the lists and details it has just made stale without either side
 * spelling the key out. Written with a leading slash everywhere, but compared
 * without one - the two spellings used to produce keys that never matched, and
 * an invalidation that matches nothing fails silently.
 */
const normalise = (endpoint: string) => endpoint.replace(/^\/+/, '').replace(/\/+$/, '')

export const endpointKey = (endpoint: string, ...parts: unknown[]): QueryKey => [normalise(endpoint), ...parts]

/** True when `key` belongs to `endpoint` or to something nested under it. */
export const belongsToEndpoint = (key: QueryKey, endpoint: string) => {
  const head = key[0]
  if (typeof head !== 'string') return false

  const root = normalise(endpoint)
  const candidate = normalise(head)

  return candidate === root || candidate.startsWith(`${root}/`) || root.startsWith(`${candidate}/`)
}

/**
 * Refetches whatever the endpoint feeds. A create, an update and a delete all
 * leave the same lists behind, and every call site used to have to remember
 * which ones.
 */
export const invalidateEndpoint = (queryClient: QueryClient, endpoint: string) =>
  queryClient.invalidateQueries({ predicate: (query) => belongsToEndpoint(query.queryKey, endpoint) })
