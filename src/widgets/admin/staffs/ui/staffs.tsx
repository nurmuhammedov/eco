import { memo } from 'react'
import { StaffsActiveTab } from '../types'
import { useTranslation } from 'react-i18next'
import { useStaffs } from '../model/use-staffs'
import { StaffsActionButton } from './action-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { CommitteeStaffDrawer, CommitteeStaffList } from '@/features/admin/committee-staffs'
import { TerritorialStaffDrawer, TerritorialStaffList } from '@/features/admin/territorial-staffs'

const StaffsWidget = () => {
  const { t } = useTranslation('common')
  const {
    activeTab,
    handleChangeTab,
    onAddCommitteeStaffs,
    onAddTerritorialStaffs,
    isOpenCommitteeStaffs,
    isOpenTerritorialStaffs,
  } = useStaffs()

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <Tabs
        className="flex flex-1 flex-col overflow-hidden"
        defaultValue={activeTab}
        onValueChange={(value: any) => handleChangeTab(value)}
      >
        <div className="flex items-center justify-between">
          <TabsList className="w-max">
            <TabsTrigger value={StaffsActiveTab.COMMITTEE_STAFFS}>{t('committee_staffs')}</TabsTrigger>
            <TabsTrigger value={StaffsActiveTab.TERRITORIAL_STAFFS}>{t('territorial_staffs')}</TabsTrigger>
          </TabsList>
          <StaffsActionButton
            activeTab={activeTab}
            onAddCommitteeStaffs={onAddCommitteeStaffs}
            onAddTerritorialStaffs={onAddTerritorialStaffs}
          />
        </div>
        <TabsContent className="mt-2 flex flex-1 flex-col overflow-hidden" value={StaffsActiveTab.COMMITTEE_STAFFS}>
          <CommitteeStaffList />
        </TabsContent>
        <TabsContent className="mt-2 flex flex-1 flex-col overflow-hidden" value={StaffsActiveTab.TERRITORIAL_STAFFS}>
          <TerritorialStaffList />
        </TabsContent>
      </Tabs>
      {isOpenCommitteeStaffs && <CommitteeStaffDrawer />}
      {isOpenTerritorialStaffs && <TerritorialStaffDrawer />}
    </div>
  )
}
export default memo(StaffsWidget)
