import { useCallback, useMemo } from 'react';
import { ActiveTab } from '../types';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters, filterParsers } from '@/shared/hooks/use-filters';
import { useCategoryTypeDrawer, useChecklistDrawer } from '@/shared/hooks/entity-hooks';

export const useInspectionManagement = () => {
  const { filters, setFilters } = useFilters({
    'active-tab': filterParsers.string('categoryType'),
  });

  const { onOpen: openCategoryTypeDrawer, isOpen: isOpenCategoryType } = useCategoryTypeDrawer();
  const { onOpen: openChecklistDrawer, isOpen: isOpenChecklist } = useChecklistDrawer();

  const activeTab = useMemo<ActiveTab>(() => filters['active-tab'] as ActiveTab, [filters]);

  const handleChangeTab = useCallback(
    (tab: ActiveTab) => setFilters((prev: any) => ({ ...prev, 'active-tab': tab })),
    [setFilters],
  );

  const openAddCategoryTypeDrawer = useCallback(() => {
    openCategoryTypeDrawer(UIModeEnum.CREATE);
  }, [openCategoryTypeDrawer]);

  const openAddChecklistDrawer = useCallback(() => {
    openChecklistDrawer(UIModeEnum.CREATE);
  }, [openChecklistDrawer]);

  return {
    filters,
    activeTab,
    isOpenCategoryType,
    isOpenChecklist,
    handleChangeTab,
    openAddCategoryTypeDrawer,
    openAddChecklistDrawer,
  };
};
