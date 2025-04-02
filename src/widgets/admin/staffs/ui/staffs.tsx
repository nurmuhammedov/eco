import { Fragment, memo } from 'react';
import { StaffsActiveTab } from '../types';
import { useTranslation } from 'react-i18next';
import { useStaffs } from '../model/use-department';
import { StaffsActionButton } from './action-button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import {
  TerritorialDepartmentsDrawer,
  TerritorialDepartmentsList,
} from '@/features/admin/territorial-departments';
import {
  CommitteeStaffDrawer,
  CommitteeStaffList,
} from '@/features/admin/committee-staffs';

const StaffsWidget = () => {
  const { t } = useTranslation('common');
  const {
    activeTab,
    handleChangeTab,
    onAddCommitteeStaffs,
    onAddTerritorialStaffs,
    isOpenCommitteeStaffs,
    isOpenTerritorialStaffs,
  } = useStaffs();

  return (
    <Fragment>
      <StaffsActionButton
        activeTab={activeTab}
        title={t('menu.staffs')}
        onAddCommitteeStaffs={onAddCommitteeStaffs}
        onAddTerritorialStaffs={onAddTerritorialStaffs}
      />
      <Tabs
        className="mt-3"
        defaultValue={activeTab}
        onValueChange={(value: any) => handleChangeTab(value)}
      >
        <TabsList>
          <TabsTrigger value={StaffsActiveTab.COMMITTEE_STAFFS}>
            {t('committee_staffs')}
          </TabsTrigger>
          <TabsTrigger value={StaffsActiveTab.TERRITORIAL_STAFFS}>
            {t('territorial_staffs')}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value={StaffsActiveTab.COMMITTEE_STAFFS}>
          <CommitteeStaffList />
        </TabsContent>
        <TabsContent
          className="mt-4"
          value={StaffsActiveTab.TERRITORIAL_STAFFS}
        >
          <TerritorialDepartmentsList />
        </TabsContent>
      </Tabs>
      {isOpenCommitteeStaffs && <CommitteeStaffDrawer />}
      {isOpenTerritorialStaffs && <TerritorialDepartmentsDrawer />}
    </Fragment>
  );
};
export default memo(StaffsWidget);
