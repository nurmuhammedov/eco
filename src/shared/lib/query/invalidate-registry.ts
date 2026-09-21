import { QueryClient } from '@tanstack/react-query'
import { belongsToEndpoint } from './endpoint-key'

/** Endpoints backing the registry pages; see build-register-query.ts. */
const REGISTRY_ENDPOINTS = ['/hf', '/equipments', '/irs', '/xrays', '/tankers', '/radiation-profiles']

/**
 * Registering an object can add it to any of the registers, and the page that
 * shows it may be a list or a detail, so all of them are refetched at once.
 */
export const invalidateRegistryQueries = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({
    predicate: ({ queryKey }) => REGISTRY_ENDPOINTS.some((endpoint) => belongsToEndpoint(queryKey, endpoint)),
  })
