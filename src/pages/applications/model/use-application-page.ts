import { useCallback } from 'react';
import { filterParsers, useFilters } from '@/shared/hooks/use-filters';

export const useApplicationPage = () => {
  const moduleFilters = {
    search: filterParsers.string(),
    type: filterParsers.string(),
    status: filterParsers.string(),
    fromDate: filterParsers.string(),
    toDate: filterParsers.string(),
  };

  const { filters, setFilters, clearFilter, clearAllFilters, metadata } =
    useFilters(moduleFilters, {
      defaultPage: 1,
      defaultSize: 10,
      preserveParams: true,
      // Debug rejimini development muhitda yoqish
      debug: process.env.NODE_ENV === 'development',
    });

  const prepareFiltersForApi = useCallback(() => {
    const { page, size, search, type, status } = filters;

    // API so'rovi uchun filtrlarni to'g'ri formatda tayyorlash
    return {
      page,
      size,
      search: search || undefined,
      type: type || undefined,
      status: status || undefined,
    };
  }, [filters]);

  console.log(prepareFiltersForApi);

  const data = () => [];

  const filterValues = {
    search: filters.search || '',
    type: filters.type || '',
    status: filters.status || '',
  };

  const handleFilterSubmit = useCallback(
    (formValues: any) => {
      // 1-sahifaga qaytib, yangi filtrlarni qo'llash
      setFilters({
        page: 1, // Yangi filtrlar qo'llanganda birinchi sahifaga qaytish
        search: formValues.search || null,
        type: formValues.type || null,
        status: formValues.status || null,
      });
    },
    [setFilters],
  );

  const handleResetFilters = useCallback(() => {
    // Faqat page va size qoldirib, qolgan barcha filtrlarni tozalash
    const currentPage = filters.page;
    const currentSize = filters.size;

    clearAllFilters();

    // Page va size ni saqlab qolish
    setFilters({
      page: currentPage,
      size: currentSize,
    });
  }, [filters.page, filters.size, clearAllFilters, setFilters]);

  return {
    applications: data || [],
    totalApplications: data || 0,
    filters: filterValues,
    handleFilterSubmit,
    handleResetFilters,
    setFilters,
    clearFilter,
    hasActiveFilters: metadata.activeFiltersCount > 0,
  };
};
