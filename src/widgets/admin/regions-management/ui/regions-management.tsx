import { Fragment } from 'react';
import { ActionButton } from './action-button';
import { RegionDrawer, RegionTable } from '@/features/admin/region';
import { useRegionManagement } from '../model/use-region-management';
import { ActiveTab } from '@/widgets/admin/regions-management/types';
import { DistrictDrawer, DistrictTable } from '@/features/admin/district';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';

export const RegionsManagement = ({
  initialTab = 'regions',
}: {
  className?: string;
  initialTab?: ActiveTab;
}) => {
  const {
    activeTab,
    isOpenRegion,
    setActiveTab,
    isOpenDistrict,
    openAddRegionDrawer,
    openAddDistrictDrawer,
  } = useRegionManagement({ initialTab });
  return (
    <Fragment>
      <ActionButton
        title="Hududlar"
        activeTab={activeTab}
        onAddRegion={openAddRegionDrawer}
        onAddDistrict={openAddDistrictDrawer}
      />
      <Tabs
        onValueChange={(value: any) => setActiveTab(value)}
        defaultValue={activeTab}
        className="mt-3"
      >
        <TabsList>
          <TabsTrigger value="regions">Вилоятлар</TabsTrigger>
          <TabsTrigger value="districts">Туманлар</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4 w-full" value="regions">
          <RegionTable />
        </TabsContent>
        <TabsContent className="mt-4 w-full" value="districts">
          <DistrictTable />
        </TabsContent>
      </Tabs>
      {isOpenRegion && <RegionDrawer />}
      {isOpenDistrict && <DistrictDrawer />}
    </Fragment>
  );
};
