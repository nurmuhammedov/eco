import { useCallback, useMemo } from 'react';
import { filterParsers, useFilters } from '@/shared/hooks/use-filters';
import { ApplicationCategory, APPLICATIONS_DATA } from '@/entities/create-application';

export function useApplicationGrid() {
  const { filters, setFilters } = useFilters({
    'active-application-tab': filterParsers.string(ApplicationCategory.XICHO),
  });

  const activeTab = useMemo<ApplicationCategory>(
    () => filters['active-application-tab'] as ApplicationCategory,
    [filters],
  );

  const filteredCards = useMemo(() => {
    return activeTab ? APPLICATIONS_DATA.filter((app) => app.category === activeTab) : APPLICATIONS_DATA;
  }, [activeTab]);

  const handleChangeTab = useCallback(
    (tab: ApplicationCategory) => setFilters((prev: any) => ({ ...prev, 'active-application-tab': tab })),
    [setFilters],
  );

  return { activeTab, filteredCards, handleChangeTab };
}
