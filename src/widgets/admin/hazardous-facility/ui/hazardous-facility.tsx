import { Fragment, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HazardousFacilityActiveTab } from '../types'
import { HazardousFacilityActionButton } from './action-button'
import { useHazardousFacility } from '../model/use-hazardous-facilities'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { HazardousFacilityTypeDrawer, HazardousFacilityTypeList } from '@/features/admin/hazardous-facility-type'

const HazardousFacilityWidget = () => {
  const { t } = useTranslation('common')
  const { activeTab, handleChangeTab, onAddHazardousFacilityType, isOpenHazardousFacilityType } = useHazardousFacility()

  return (
    <Fragment>
      <HazardousFacilityActionButton
        activeTab={activeTab}
        title={t('menu.hazardous_facilities')}
        onAddHazardousFacilityType={onAddHazardousFacilityType}
      />
      <Tabs className="mt-3" defaultValue={activeTab} onValueChange={(value: any) => handleChangeTab(value)}>
        <TabsList>
          <TabsTrigger value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_TYPE}>
            {t('hazardous_facilities_type')}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value={HazardousFacilityActiveTab.HAZARDOUS_FACILITY_TYPE}>
          <HazardousFacilityTypeList />
        </TabsContent>
      </Tabs>
      {isOpenHazardousFacilityType && <HazardousFacilityTypeDrawer />}
    </Fragment>
  )
}
export default memo(HazardousFacilityWidget)
