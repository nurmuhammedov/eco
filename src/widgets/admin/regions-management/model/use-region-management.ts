import { useState } from 'react';
import { ActiveTab } from '../types';
import { UIModeEnum } from '@/shared/types/ui-types';
import {
  filterParsers,
  useFilters,
} from '@/shared/hooks/use-filters/use-filters.ts';
import {
  useDistrictDrawer,
  useRegionDrawer,
} from '@/shared/hooks/entity-hooks';

export interface UseRegionsManagementProps {
  initialTab?: ActiveTab;
}

export const useRegionManagement = (props: UseRegionsManagementProps) => {
  const { filters, setFilters } = useFilters({
    'active-tab': filterParsers.string('regions'),
  });

  const { onOpen: openRegionDrawer, isOpen: isOpenRegion } = useRegionDrawer();

  const { onOpen: openDistrictDrawer, isOpen: isOpenDistrict } =
    useDistrictDrawer();

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    props.initialTab || 'districts',
  );

  const handleChangeTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setFilters({ ...filters, 'active-tab': tab });
  };

  const openAddRegionDrawer = () => {
    openRegionDrawer(UIModeEnum.CREATE);
  };

  const openEditRegionDrawer = () => {
    openRegionDrawer(UIModeEnum.EDIT);
  };

  const openAddDistrictDrawer = () => {
    openDistrictDrawer(UIModeEnum.CREATE);
  };

  const openEditDistrictDrawer = () => {
    openDistrictDrawer(UIModeEnum.EDIT);
  };

  return {
    filters,
    setActiveTab,
    isOpenRegion,
    isOpenDistrict,
    handleChangeTab,
    openAddRegionDrawer,
    openEditRegionDrawer,
    openAddDistrictDrawer,
    openEditDistrictDrawer,
    activeTab: filters['active-tab'] || activeTab,
  };
};
