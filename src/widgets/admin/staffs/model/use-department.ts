import { StaffsActiveTab } from '../types';
import { useCallback, useMemo } from 'react';
import { UIModeEnum } from '@/shared/types/ui-types';
import { filterParsers, useFilters } from '@/shared/hooks/use-filters';
import {
  useCommitteeStaffsDrawer,
  useTerritorialStaffsDrawer,
} from '@/shared/hooks/entity-hooks';

export const useStaffs = () => {
  const { filters, setFilters } = useFilters({
    'active-tab': filterParsers.string(StaffsActiveTab.COMMITTEE_STAFFS),
  });

  const { onOpen: openCommitteeStaffsDrawer, isOpen: isOpenCommitteeStaffs } =
    useCommitteeStaffsDrawer();

  const {
    onOpen: openTerritorialStaffsDrawer,
    isOpen: isOpenTerritorialStaffs,
  } = useTerritorialStaffsDrawer();

  const activeTab = useMemo<StaffsActiveTab>(
    () => filters['active-tab'] as StaffsActiveTab,
    [filters],
  );

  const handleChangeTab = useCallback(
    (tab: StaffsActiveTab) =>
      setFilters((prev: any) => ({ ...prev, 'active-tab': tab })),
    [setFilters],
  );

  const onAddCommitteeStaffs = useCallback(() => {
    openCommitteeStaffsDrawer(UIModeEnum.CREATE);
  }, [openCommitteeStaffsDrawer]);

  const onAddTerritorialStaffs = useCallback(() => {
    openTerritorialStaffsDrawer(UIModeEnum.CREATE);
  }, [openTerritorialStaffsDrawer]);

  return {
    filters,
    activeTab,
    handleChangeTab,
    onAddCommitteeStaffs,
    onAddTerritorialStaffs,
    isOpenCommitteeStaffs,
    isOpenTerritorialStaffs,
  };
};
