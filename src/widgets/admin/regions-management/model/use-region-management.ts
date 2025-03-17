import { useState } from 'react';
import { UIModeEnum } from '@/shared/types/ui-types';
import {
  useDistrictDrawer,
  useRegionDrawer,
} from '@/shared/hooks/entity-hooks';
import { ActiveTab } from '../types';

export interface UseRegionsManagementProps {
  initialTab?: ActiveTab;
}

export const useRegionManagement = (props: UseRegionsManagementProps) => {
  const { onOpen: openRegionDrawer, isOpen: isOpenRegion } = useRegionDrawer();
  const { onOpen: openDistrictDrawer, isOpen: isOpenDistrict } =
    useDistrictDrawer();
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    props.initialTab || 'districts',
  );

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
    activeTab,
    setActiveTab,
    isOpenRegion,
    isOpenDistrict,
    openAddRegionDrawer,
    openEditRegionDrawer,
    openAddDistrictDrawer,
    openEditDistrictDrawer,
  };
};
