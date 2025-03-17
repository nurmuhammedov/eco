import { Fragment } from 'react';
import { ActionButton } from './action-button';
import { DistrictDrawer, DistrictTable } from '@/features/admin/district';
import { ActiveTab } from '@/widgets/admin/regions-management/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { useRegionManagement } from '@/widgets/admin/regions-management/model/use-region-management';

export const RegionsManagement = ({
  initialTab = 'districts',
}: {
  className?: string;
  initialTab?: ActiveTab;
}) => {
  const {
    openAddDistrictDrawer,
    openAddRegionDrawer,
    activeTab,
    setActiveTab,
    isOpenDistrict,
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
          Make changes to your account here.
        </TabsContent>
        <TabsContent className="mt-4 w-full" value="districts">
          <DistrictTable />
        </TabsContent>
      </Tabs>
      {isOpenDistrict && <DistrictDrawer />}
    </Fragment>
  );
};
