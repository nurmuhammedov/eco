import { ApplicationStatus } from '@/entities/application';
import { useApplicationList } from '@/features/application-table/hooks/index';
import { useTranslatedObject } from '@/shared/hooks';
import { filterParsers, useFilters } from '@/shared/hooks/use-filters';
import { useCallback, useMemo } from 'react';

export const useApplicationPage = () => {
  const moduleFilters = {
    status: filterParsers.string(ApplicationStatus.ALL),
    search: filterParsers.string(),
    type: filterParsers.string(),
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

  const { data = [] } = useApplicationList({ ...filters, status: filters?.status !== 'ALL' ? filters?.status : '' });
  console.log(data, 'da');

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

  const activeTab = useMemo<string>(() => filters['status'] as ApplicationStatus, [filters]);

  const handleChangeTab = useCallback(
    (tab: string) => setFilters((prev: any) => ({ ...prev, status: tab })),
    [setFilters],
  );

  const handleResetFilters = useCallback(() => {
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
    handleChangeTab,
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
