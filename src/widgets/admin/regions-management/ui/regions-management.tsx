import { Fragment } from 'react'
import { ActionButton } from './action-button'
import { useTranslation } from 'react-i18next'
import { RegionDrawer, RegionList } from '@/features/admin/region'
import { useRegionManagement } from '../model/use-region-management'
import { DistrictDrawer, DistrictList } from '@/features/admin/districts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

const RegionsManagement = () => {
  const { t } = useTranslation('common')
  const { activeTab, isOpenRegion, isOpenDistrict, handleChangeTab, openAddRegionDrawer, openAddDistrictDrawer } =
    useRegionManagement()

  return (
    <Fragment>
      <ActionButton
        activeTab={activeTab}
        title={t('menu.territories')}
        onAddRegion={openAddRegionDrawer}
        onAddDistrict={openAddDistrictDrawer}
      />
      <Tabs className="mt-3" defaultValue={activeTab} onValueChange={(value: any) => handleChangeTab(value)}>
        <TabsList>
          <TabsTrigger value="regions">{t('regions')}</TabsTrigger>
          <TabsTrigger value="districts">{t('districts')}</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value="regions">
          <RegionList />
        </TabsContent>
        <TabsContent className="mt-4" value="districts">
          <DistrictList />
        </TabsContent>
      </Tabs>
      {isOpenRegion && <RegionDrawer />}
      {isOpenDistrict && <DistrictDrawer />}
    </Fragment>
  )
}
export default RegionsManagement
