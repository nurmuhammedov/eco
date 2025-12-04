import { Fragment, memo } from 'react'
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
    <Fragment>
      <DepartmentActionButton
        activeTab={activeTab}
        onAddApparatus={onAddApparatus}
        onAddDepartment={onAddDepartment}
        title={t('menu.departments')}
      />
      <Tabs className="mt-3" defaultValue={activeTab} onValueChange={(value: any) => handleChangeTab(value)}>
        <TabsList>
          <TabsTrigger value={DepartmentActiveTab.CENTRAL_APPARATUS}>{t('central_apparatus')}</TabsTrigger>
          <TabsTrigger value={DepartmentActiveTab.TERRITORIAL_DEPARTMENTS}>{t('territorial_departments')}</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value={DepartmentActiveTab.CENTRAL_APPARATUS}>
          <CentralApparatusList />
        </TabsContent>
        <TabsContent className="mt-4" value={DepartmentActiveTab.TERRITORIAL_DEPARTMENTS}>
          <TerritorialDepartmentsList />
        </TabsContent>
      </Tabs>
      {isOpenCentralApparatus && <CentralApparatusDrawer />}
      {isOpenTerritorialDepartments && <TerritorialDepartmentsDrawer />}
    </Fragment>
  )
}
export default memo(DepartmentWidget)
