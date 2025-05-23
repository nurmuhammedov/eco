import { useCallback, useMemo } from 'react';
import { filterParsers, useFilters } from '@/shared/hooks/use-filters';
import {
  ApplicationCategory,
  APPLICATIONS_DATA,
  MAIN_APPLICATION_BY_CATEGORY,
  MainApplicationCategory,
} from '@/entities/create-application';

export function useApplicationGrid() {
  const { filters, setFilters } = useFilters({
    'selected-main-card': filterParsers.string(MainApplicationCategory.REGISTER),
    'active-application-tab': filterParsers.string(ApplicationCategory.XICHO),
  });

  const activeTab = useMemo<ApplicationCategory>(
    () => filters['active-application-tab'] as ApplicationCategory,
    [filters],
  );

  const selectedMainCard = useMemo<MainApplicationCategory | null>(
    () => filters['selected-main-card'] as MainApplicationCategory | null,
    [filters],
  );

  const handleChangeTab = useCallback(
    (tab: ApplicationCategory) =>
      setFilters((prev: any) => ({
        ...prev,
        'active-application-tab': tab,
        'selected-main-card': null,
      })),
    [setFilters],
  );

  const handleMainCardSelect = useCallback(
    (cardId: string) =>
      setFilters({
        'selected-main-card': filters['selected-main-card'] === cardId ? null : cardId,
      }),
    [filters, setFilters],
  );

  const mainCards = useMemo(() => {
    if (!activeTab) return [];
    return MAIN_APPLICATION_BY_CATEGORY[activeTab] || [];
  }, [activeTab]);

  const displayedSubCards = useMemo(() => {
    if (!activeTab) return [];

    // If there are main cards for this category
    if (MAIN_APPLICATION_BY_CATEGORY[activeTab]?.length > 0) {
      // If a main card is selected, show its sub applications
      if (selectedMainCard) {
        return APPLICATIONS_DATA.filter((card) => card.category === activeTab && card.parentId === selectedMainCard);
      }
      return []; // No main card selected, show no applications
    }

    // If no main cards for this category, show all applications for the category with no parent
    return APPLICATIONS_DATA.filter((card) => card.category === activeTab && !card.parentId);
  }, [activeTab, selectedMainCard]);

  return {
    mainCards,
    activeTab,
    handleChangeTab,
    selectedMainCard,
    displayedSubCards,
    handleMainCardSelect,
  };
}
