import { useCallback, useState } from 'react';
import { useTranslatedObject } from '@/shared/hooks';
import { ApplicationStatus } from '@/entities/application';
import { filterParsers, useFilters } from '@/shared/hooks/use-filters';

export const useApplicationPage = () => {
  const moduleFilters = {
    search: filterParsers.string(),
    type: filterParsers.string(),
    status: filterParsers.string(),
    fromDate: filterParsers.string(),
    toDate: filterParsers.string(),
  };

  const applicationStatus = useTranslatedObject(ApplicationStatus, 'application_status', false);

  const { filters, setFilters, clearFilter, clearAllFilters, metadata } = useFilters(moduleFilters, {
    defaultPage: 1,
    defaultSize: 10,
    preserveParams: true,
    // Debug rejimini development muhitda yoqish
    debug: process.env.NODE_ENV === 'development',
  });

  const [activeTab, setActiveTab] = useState(ApplicationStatus.ALL);

  const prepareFiltersForApi = useCallback(() => {
    const { page, size, search, type, status } = filters;

    // api so'rovi uchun filtrlarni to'g'ri formatda tayyorlash
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
      setFilters({
        page: 1,
        search: formValues.search || null,
        type: formValues.type || null,
        status: formValues.status || null,
      });
    },
    [setFilters],
  );

  const handleTabChange = useCallback((value: ApplicationStatus | string) => {
    setActiveTab(value as ApplicationStatus);
  }, []);

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
    activeTab,
    setActiveTab,
    handleTabChange,
    applicationStatus,
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
