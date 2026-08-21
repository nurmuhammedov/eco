import { getTime } from '@/shared/lib/get-time'

/**
 * Default freshness window for list and detail queries.
 *
 * Long enough that switching tabs or going back to a page is instant instead of
 * refetching on every mount, short enough that a missed invalidation heals by
 * itself. Queries that must always be fresh keep an explicit `staleTime: 0`.
 */
export const DEFAULT_STALE_TIME = getTime(30, 'second')

/**
 * Freshness window for the reference lists behind selects and filters: regions,
 * districts, offices, departments, facility types.
 *
 * Only an admin can change these and they are read on almost every form, so
 * refetching them per mount costs a request on each navigation for a list that
 * is the same all day. The cache is in memory, so a reload still picks up an
 * edit made elsewhere.
 */
export const DICTIONARY_STALE_TIME = getTime(1, 'week')
