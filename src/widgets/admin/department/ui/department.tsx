import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDepartment } from '../model/use-department'
import { DepartmentActionButton } from './action-button'
import { DepartmentActiveTab } from '@/widgets/admin/department/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { CentralApparatusDrawer, CentralApparatusList } from '@/features/admin/central-apparatus'
import { TerritorialDepartmentsDrawer, TerritorialDepartmentsList } from '@/features/admin/territorial-departments'

const DepartmentWidget = () => {
  const { t } = useTranslation('common')
  const {
    activeTab,
    onAddApparatus,
    onAddDepartment,
    handleChangeTab,
    isOpenCentralApparatus,
    isOpenTerritorialDepartments,
  } = useDepartment()

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <Tabs
        className="flex flex-1 flex-col overflow-hidden"
        defaultValue={activeTab}
        onValueChange={(value: any) => handleChangeTab(value)}
      >
        <div className="flex items-center justify-between">
          <TabsList className="w-max">
            <TabsTrigger value={DepartmentActiveTab.CENTRAL_APPARATUS}>{t('central_apparatus')}</TabsTrigger>
            <TabsTrigger value={DepartmentActiveTab.TERRITORIAL_DEPARTMENTS}>
              {t('territorial_departments')}
            </TabsTrigger>
          </TabsList>
          <DepartmentActionButton
            activeTab={activeTab}
            onAddApparatus={onAddApparatus}
            onAddDepartment={onAddDepartment}
          />
        </div>
        <TabsContent
          className="mt-2 flex flex-1 flex-col overflow-hidden"
          value={DepartmentActiveTab.CENTRAL_APPARATUS}
        >
          <CentralApparatusList />
        </TabsContent>
        <TabsContent
          className="mt-2 flex flex-1 flex-col overflow-hidden"
          value={DepartmentActiveTab.TERRITORIAL_DEPARTMENTS}
        >
          <TerritorialDepartmentsList />
        </TabsContent>
      </Tabs>
      {isOpenCentralApparatus && <CentralApparatusDrawer />}
      {isOpenTerritorialDepartments && <TerritorialDepartmentsDrawer />}
    </div>
  )
}
export default memo(DepartmentWidget)
