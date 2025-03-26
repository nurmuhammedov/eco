import { Fragment } from 'react';
import { ActionButton } from './action-button';
import { useTranslation } from 'react-i18next';
import { RegionDrawer, RegionList } from '@/features/admin/region';
import { useRegionManagement } from '../model/use-region-management';
import { ActiveTab } from '@/widgets/admin/regions-management/types';
import { DistrictDrawer, DistrictList } from '@/features/admin/districts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';

const RegionsManagement = ({
  initialTab = 'regions',
}: {
  className?: string;
  initialTab?: ActiveTab;
}) => {
  const { t } = useTranslation('common');
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
        activeTab={activeTab}
        title={t('territories')}
        onAddRegion={openAddRegionDrawer}
        onAddDistrict={openAddDistrictDrawer}
      />
      <Tabs
        className="mt-3"
        defaultValue={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList>
          <TabsTrigger value="regions">{t('regions')}</TabsTrigger>
          <TabsTrigger value="districts">{t('districts')}</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4 w-full" value="regions">
          <RegionList />
        </TabsContent>
        <TabsContent className="mt-4 w-full" value="districts">
          <DistrictList />
        </TabsContent>
      </Tabs>
      {isOpenRegion && <RegionDrawer />}
      {isOpenDistrict && <DistrictDrawer />}
    </Fragment>
  );
};
export default RegionsManagement;
