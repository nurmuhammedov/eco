import { parseAsInteger, Parser, useQueryStates } from 'nuqs';
import { useCallbackRef } from '@/shared/hooks/use-callback-ref';

type FilterParsers = Record<string, Parser<any>>;

export function useFilters(moduleFilters?: FilterParsers) {
  const commonFilters: FilterParsers = {
    page: parseAsInteger.withDefault(1),
    size: parseAsInteger.withDefault(20),
  };

  const mergedFilters = { ...commonFilters, ...moduleFilters };

  const [filters, setFilters] = useQueryStates(mergedFilters);

  const setFiltersRef = useCallbackRef(setFilters);

  // **Bitta filterni tozalash**
  const clearFilter = useCallbackRef((key: keyof typeof mergedFilters) => {
    setFiltersRef({ [key]: null });
  });

  const clearAllFilters = useCallbackRef(() => {
    const resetFilters = Object.keys(filters).reduce(
      (acc, key) => {
        acc[key] = null;
        return acc;
      },
      {} as Record<string, null>,
    );
    setFiltersRef(resetFilters);
  });

  return { filters, setFilters: setFiltersRef, clearFilter, clearAllFilters };
}
