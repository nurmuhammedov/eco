import { ActiveTab } from '../types';
import { useCallback, useMemo } from 'react';
import { UIModeEnum } from '@/shared/types/ui-types';
import { filterParsers, useFilters } from '@/shared/hooks/use-filters';
import {
  useDistrictDrawer,
  useRegionDrawer,
} from '@/shared/hooks/entity-hooks';

export const useRegionManagement = () => {
  const { filters, setFilters } = useFilters({
    'active-tab': filterParsers.string('regions'),
  });

  const { onOpen: openRegionDrawer, isOpen: isOpenRegion } = useRegionDrawer();

  const { onOpen: openDistrictDrawer, isOpen: isOpenDistrict } =
    useDistrictDrawer();

  const activeTab = useMemo<ActiveTab>(
    () => filters['active-tab'] as ActiveTab,
    [filters],
  );

  const handleChangeTab = useCallback(
    (tab: ActiveTab) =>
      setFilters((prev: any) => ({ ...prev, 'active-tab': tab })),
    [setFilters],
  );

  const openAddRegionDrawer = useCallback(() => {
    openRegionDrawer(UIModeEnum.CREATE);
  }, [openRegionDrawer]);

  const openEditRegionDrawer = useCallback(() => {
    openRegionDrawer(UIModeEnum.EDIT);
  }, [openRegionDrawer]);

  const openAddDistrictDrawer = useCallback(() => {
    openDistrictDrawer(UIModeEnum.CREATE);
  }, [openDistrictDrawer]);

  const openEditDistrictDrawer = useCallback(() => {
    openDistrictDrawer(UIModeEnum.EDIT);
  }, [openDistrictDrawer]);

  return {
    filters,
    activeTab,
    isOpenRegion,
    isOpenDistrict,
    handleChangeTab,
    openAddRegionDrawer,
    openEditRegionDrawer,
    openAddDistrictDrawer,
    openEditDistrictDrawer,
  };
};
