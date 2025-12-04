export enum StaffsActiveTab {
  COMMITTEE_STAFFS = 'committee-staffs',
  TERRITORIAL_STAFFS = 'territorial-staffs',
}

export type StaffsActiveTabActionButtonProps = {
  title: string
  activeTab: StaffsActiveTab
  onAddCommitteeStaffs: () => void
  onAddTerritorialStaffs: () => void
}
