import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HazardousFacilityActiveTab } from '../types'
import { HazardousFacilityActionButton } from './action-button'
import { useHazardousFacility } from '../model/use-hazardous-facilities'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { HazardousFacilityTypeDrawer, HazardousFacilityTypeList } from '@/features/admin/hazardous-facility-type'
import {
  HazardousFacilityCategoryDrawer,
  HazardousFacilityCategoryList,
} from '@/features/admin/hazardous-facility-category'

const HazardousFacilityWidget = () => {
  const { t } = useTranslation('common')
  const {
    activeTab,
    handleChangeTab,
    onAddHazardousFacilityType,
    isOpenHazardousFacilityType,
    onAddHazardousFacilityCategory,
    isOpenHazardousFacilityCategory,
  } = useHazardousFacility()

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <Tabs
        className="flex flex-1 flex-col overflow-hidden"
        defaultValue={activeTab}
        onValueChange={(value: any) => handleChangeTab(value)}
      >
        <div className="flex items-center justify-between">
          <TabsList className="w-max">
            <TabsTrigger value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_TYPE}>
              {t('hazardous_facilities_type')}
            </TabsTrigger>
            <TabsTrigger value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_CATEGORY}>
              {t('hazardous_facilities_category')}
            </TabsTrigger>
          </TabsList>
          <HazardousFacilityActionButton
            activeTab={activeTab}
            onAddHazardousFacilityType={onAddHazardousFacilityType}
            onAddHazardousFacilityCategory={onAddHazardousFacilityCategory}
          />
        </div>
        <TabsContent
          className="mt-2 flex flex-1 flex-col overflow-hidden"
          value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_TYPE}
        >
          <HazardousFacilityTypeList />
        </TabsContent>
        <TabsContent
          className="mt-2 flex flex-1 flex-col overflow-hidden"
          value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_CATEGORY}
        >
          <HazardousFacilityCategoryList />
        </TabsContent>
      </Tabs>
      {isOpenHazardousFacilityType && <HazardousFacilityTypeDrawer />}
      {isOpenHazardousFacilityCategory && <HazardousFacilityCategoryDrawer />}
    </div>
  )
}
export default memo(HazardousFacilityWidget)
