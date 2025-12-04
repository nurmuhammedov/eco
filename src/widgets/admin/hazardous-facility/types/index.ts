export enum HazardousFacilityActiveTab {
  HAZARDOUS_FACILITY_TYPE = 'hazardous-facility-type',
  HAZARDOUS_FACILITY_ = 'territorial-staffs',
}

export type HazardousFacilityActiveTabActionButtonProps = {
  title: string
  activeTab: HazardousFacilityActiveTab
  onAddHazardousFacilityType: () => void
}
