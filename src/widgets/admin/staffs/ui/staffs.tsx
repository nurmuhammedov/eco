import { Fragment, memo } from 'react';
import { StaffsActiveTab } from '../types';
import { useTranslation } from 'react-i18next';
import { useStaffs } from '../model/use-staffs';
import { StaffsActionButton } from './action-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { CommitteeStaffDrawer, CommitteeStaffList } from '@/features/admin/committee-staffs';
import { TerritorialStaffDrawer, TerritorialStaffList } from '@/features/admin/territorial-staffs';

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
      <Tabs className="mt-3" defaultValue={activeTab} onValueChange={(value: any) => handleChangeTab(value)}>
        <TabsList>
          <TabsTrigger value={StaffsActiveTab.COMMITTEE_STAFFS}>{t('committee_staffs')}</TabsTrigger>
          <TabsTrigger value={StaffsActiveTab.TERRITORIAL_STAFFS}>{t('territorial_staffs')}</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value={StaffsActiveTab.COMMITTEE_STAFFS}>
          <CommitteeStaffList />
        </TabsContent>
        <TabsContent className="mt-4" value={StaffsActiveTab.TERRITORIAL_STAFFS}>
          <TerritorialStaffList />
        </TabsContent>
      </Tabs>
      {isOpenCommitteeStaffs && <CommitteeStaffDrawer />}
      {isOpenTerritorialStaffs && <TerritorialStaffDrawer />}
    </Fragment>
  );
};
export default memo(StaffsWidget);
