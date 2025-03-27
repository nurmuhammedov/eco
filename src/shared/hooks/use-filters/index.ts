import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  type Parser,
  useQueryStates,
} from 'nuqs';
import { useCallback, useMemo } from 'react';

export type FilterParser<T = any> = Parser<T>;

export type FilterParsers = Record<string, FilterParser>;

export type FilterValues = Record<string, any>;

export interface UseFiltersConfig {
  baseFilters?: FilterParsers;
  defaultPage?: number;
  defaultSize?: number;
  preserveParams?: boolean;
  onFiltersChange?: (filters: FilterValues) => void;
  debug?: boolean;
}

export interface UseFiltersResult {
  filters: FilterValues;
  setFilters: (newFilters: Record<string, any>) => void;
  clearFilter: (key: string) => void;
  clearAllFilters: () => void;
  resetFilters: () => void;
  metadata: {
    hasFilters: boolean;
    filterKeys: string[];
    activeFiltersCount: number;
  };
}

export function useFilters(
  moduleFilters: FilterParsers = {},
  config: UseFiltersConfig = {},
): UseFiltersResult {
  const {
    baseFilters = {},
    defaultPage = 1,
    defaultSize = 20,
    preserveParams = true,
    onFiltersChange,
    debug = false,
  } = config;

  const commonFilters: FilterParsers = useMemo(
    () => ({
      page: parseAsInteger.withDefault(defaultPage),
      size: parseAsInteger.withDefault(defaultSize),
    }),
    [defaultPage, defaultSize],
  );

  const mergedFilters: FilterParsers = useMemo(
    () => ({
      ...commonFilters,
      ...baseFilters,
      ...moduleFilters,
    }),
    [commonFilters, baseFilters, moduleFilters],
  );

  const [filters, setFiltersBase] = useQueryStates(mergedFilters);

  const setFilters = useCallback(
    (newFilters: Record<string, any>) => {
      if (debug) {
        console.log('Setting filters:', newFilters);
      }

      const options = {
        shallow: true,
        preserveParams,
      };

      setFiltersBase(newFilters, options);

      if (onFiltersChange) {
        const updatedFilters = { ...filters, ...newFilters };
        onFiltersChange(updatedFilters);
      }
    },
    [setFiltersBase, preserveParams, filters, onFiltersChange, debug],
  );

  const clearFilter = useCallback(
    (key: string) => {
      if (key in mergedFilters) {
        setFilters({ [key]: null });
      } else if (debug) {
        console.warn(`Filter key "${key}" not found in defined filters`);
      }
    },
    [mergedFilters, setFilters, debug],
  );

  const clearAllFilters = useCallback(() => {
    const resetFilters = Object.keys(mergedFilters).reduce<
      Record<string, null>
    >((acc, key) => {
      acc[key] = null;
      return acc;
    }, {});

    setFilters(resetFilters);
  }, [mergedFilters, setFilters]);

  const resetFilters = useCallback(() => {
    setFiltersBase({}, { clearOnDefault: true });
  }, [setFiltersBase]);

  const metadata = useMemo(
    () => ({
      filterKeys: Object.keys(mergedFilters),
      hasFilters: Object.keys(filters).length > 0,
      activeFiltersCount: Object.values(filters).filter(
        (value) => value !== null && value !== undefined,
      ).length,
    }),
    [mergedFilters, filters],
  );

  return {
    filters,
    setFilters,
    clearFilter,
    clearAllFilters,
    resetFilters,
    metadata,
  };
}

export const filterParsers = {
  integer: (defaultValue?: number): FilterParser<number> =>
    parseAsInteger.withDefault(defaultValue ?? 0),

  string: (defaultValue?: string): FilterParser<string> =>
    parseAsString.withDefault(defaultValue ?? ''),

  boolean: (defaultValue?: boolean): FilterParser<boolean> =>
    parseAsBoolean.withDefault(defaultValue ?? false),

  integerArray: (defaultValue?: number[]): FilterParser<number[]> =>
    parseAsArrayOf(parseAsInteger).withDefault(defaultValue ?? []),

  stringArray: (defaultValue?: string[]): FilterParser<string[]> =>
    parseAsArrayOf(parseAsString).withDefault(defaultValue ?? []),
};
