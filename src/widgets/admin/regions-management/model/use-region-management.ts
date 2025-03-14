import { useState } from 'react';
import { useUI } from '@/entities/ui';
import { UIModeEnum } from '@/entities/ui/types/ui-types';

export type ActiveTab = 'regions' | 'districts';

export interface UseRegionsManagementProps {
  initialTab?: ActiveTab;
}

export const useRegionManagement = (props: UseRegionsManagementProps) => {
  const { onOpen } = useUI();
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    props.initialTab || 'regions',
  );

  const openAddRegionDrawer = () => {
    onOpen(UIModeEnum.CREATE, 'region');
  };

  const openEditRegionDrawer = () => {
    onOpen(UIModeEnum.UPDATE, 'region');
  };

  const openAddDistrictDrawer = () => {
    onOpen(UIModeEnum.CREATE, 'district-drawer');
  };

  const openEditDistrictDrawer = () => {
    onOpen(UIModeEnum.UPDATE, 'district-drawer');
  };

  return {
    activeTab,
    setActiveTab,
    openAddRegionDrawer,
    openEditRegionDrawer,
    openAddDistrictDrawer,
    openEditDistrictDrawer,
  };
};
