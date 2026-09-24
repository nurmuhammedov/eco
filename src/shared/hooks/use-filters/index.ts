import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  type SetValues,
  type UseQueryStatesKeysMap,
  type Values,
  useQueryStates,
} from 'nuqs'
import { useCallback, useMemo } from 'react'

export type FilterParsers = UseQueryStatesKeysMap

type NoFilters = Record<never, never>

const pagingParsers = (page: number, size: number) => ({
  page: parseAsInteger.withDefault(page),
  size: parseAsInteger.withDefault(size),
})

type PagingParsers = ReturnType<typeof pagingParsers>

export interface UseFiltersConfig<B extends FilterParsers = NoFilters> {
  baseFilters?: B
  defaultPage?: number
  defaultSize?: number
  onFiltersChange?: (filters: Values<PagingParsers & B>) => void
  debug?: boolean
}

/**
 * Filters kept in the query string, typed from their parsers: page and size
 * always, plus whatever the module adds.
 */
export function useFilters<M extends FilterParsers = NoFilters, B extends FilterParsers = NoFilters>(
  moduleFilters: M = {} as M,
  config: UseFiltersConfig<B> = {}
) {
  const { baseFilters = {} as B, defaultPage = 1, defaultSize = 20, onFiltersChange, debug = false } = config

  type Parsers = PagingParsers & B & M

  const mergedFilters = useMemo(
    () => ({ ...pagingParsers(defaultPage, defaultSize), ...baseFilters, ...moduleFilters }) as Parsers,
    [defaultPage, defaultSize, baseFilters, moduleFilters]
  )

  const [filters, setFiltersBase] = useQueryStates(mergedFilters)

  const setFilters = useCallback(
    (newFilters: Parameters<SetValues<Parsers>>[0]) => {
      if (debug) {
        console.warn('Setting filters:', newFilters)
      }

      void setFiltersBase(newFilters, { shallow: true })

      if (onFiltersChange) {
        // An updater has to be run to know what the filters become
        const patch = typeof newFilters === 'function' ? newFilters(filters) : newFilters
        onFiltersChange({ ...filters, ...patch } as Values<PagingParsers & B>)
      }
    },
    [setFiltersBase, filters, onFiltersChange, debug]
  )

  const clearFilter = useCallback(
    (key: string) => {
      if (key in mergedFilters) {
        setFilters({ [key]: null } as Parameters<SetValues<Parsers>>[0])
      } else if (debug) {
        console.warn(`Filter key "${key}" not found in defined filters`)
      }
    },
    [mergedFilters, setFilters, debug]
  )

  const clearAllFilters = useCallback(() => {
    const cleared = Object.fromEntries(Object.keys(mergedFilters).map((key) => [key, null]))

    setFilters(cleared as Parameters<SetValues<Parsers>>[0])
  }, [mergedFilters, setFilters])

  const resetFilters = useCallback(() => {
    void setFiltersBase({}, { clearOnDefault: true })
  }, [setFiltersBase])

  const metadata = useMemo(
    () => ({
      filterKeys: Object.keys(mergedFilters),
      hasFilters: Object.keys(filters).length > 0,
      activeFiltersCount: Object.values(filters).filter((value) => value !== null && value !== undefined).length,
    }),
    [mergedFilters, filters]
  )

  return {
    filters,
    setFilters,
    clearFilter,
    clearAllFilters,
    resetFilters,
    metadata,
  }
}

export const filterParsers = {
  integer: (defaultValue?: number) => parseAsInteger.withDefault(defaultValue ?? 0),

  string: (defaultValue?: string) => parseAsString.withDefault(defaultValue ?? ''),

  boolean: (defaultValue?: boolean) => parseAsBoolean.withDefault(defaultValue ?? false),

  integerArray: (defaultValue?: number[]) => parseAsArrayOf(parseAsInteger).withDefault(defaultValue ?? []),

  stringArray: (defaultValue?: string[]) => parseAsArrayOf(parseAsString).withDefault(defaultValue ?? []),
}
