import { getTime } from '@/shared/lib/get-time'

/**
 * Default freshness window for list and detail queries.
 *
 * Long enough that switching tabs or going back to a page is instant instead of
 * refetching on every mount, short enough that a missed invalidation heals by
 * itself. Queries that must always be fresh keep an explicit `staleTime: 0`.
 */
export const DEFAULT_STALE_TIME = getTime(30, 'second')
