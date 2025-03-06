import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useFilters = <T extends Record<string, string | number>>(
  namespace: string,
  defaultFilters?: T,
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const obj: Record<string, string> = { ...defaultFilters } as Record<
      string,
      string
    >;
    searchParams.forEach((value, key) => {
      if (key.startsWith(`${namespace}_`)) {
        obj[key.replace(`${namespace}_`, '')] = value;
      }
    });
    return obj;
  }, [searchParams, defaultFilters, namespace]);

  // 🔹 `useCallback` bilan funksiyani qayta yaratishdan saqlash
  const updateFilter = useCallback(
    (key: string, value: string | number, replace = true) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          const filterKey = `${namespace}_${key}`;

          if (!value) {
            newParams.delete(filterKey);
          } else {
            newParams.set(filterKey, value.toString());
          }
          return newParams;
        },
        { replace },
      );
    },
    [setSearchParams, namespace],
  );

  return { filters, updateFilter };
};
