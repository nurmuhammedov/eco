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
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <Tabs
        className="flex flex-1 flex-col overflow-hidden"
        defaultValue={activeTab}
        onValueChange={(value: any) => handleChangeTab(value)}
      >
        <div className="flex items-center justify-between">
          <TabsList className="w-max">
            <TabsTrigger value="regions">{t('regions')}</TabsTrigger>
            <TabsTrigger value="districts">{t('districts')}</TabsTrigger>
          </TabsList>
          <ActionButton activeTab={activeTab} onAddRegion={openAddRegionDrawer} onAddDistrict={openAddDistrictDrawer} />
        </div>
        <TabsContent className="mt-2 flex flex-1 flex-col overflow-hidden" value="regions">
          <RegionList />
        </TabsContent>
        <TabsContent className="mt-2 flex flex-1 flex-col overflow-hidden" value="districts">
          <DistrictList />
        </TabsContent>
      </Tabs>
      {isOpenRegion && <RegionDrawer />}
      {isOpenDistrict && <DistrictDrawer />}
    </div>
  )
}
export default RegionsManagement
