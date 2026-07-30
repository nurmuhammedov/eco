import { Fragment, memo } from 'react'
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
    <Fragment>
      <HazardousFacilityActionButton
        activeTab={activeTab}
        title={t('menu.hazardous_facilities')}
        onAddHazardousFacilityType={onAddHazardousFacilityType}
        onAddHazardousFacilityCategory={onAddHazardousFacilityCategory}
      />
      <Tabs className="mt-3" defaultValue={activeTab} onValueChange={(value: any) => handleChangeTab(value)}>
        <TabsList>
          <TabsTrigger value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_TYPE}>
            {t('hazardous_facilities_type')}
          </TabsTrigger>
          <TabsTrigger value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_CATEGORY}>
            {t('hazardous_facilities_category')}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_TYPE}>
          <HazardousFacilityTypeList />
        </TabsContent>
        <TabsContent className="mt-4" value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_CATEGORY}>
          <HazardousFacilityCategoryList />
        </TabsContent>
      </Tabs>
      {isOpenHazardousFacilityType && <HazardousFacilityTypeDrawer />}
      {isOpenHazardousFacilityCategory && <HazardousFacilityCategoryDrawer />}
    </Fragment>
  )
}
export default memo(HazardousFacilityWidget)
