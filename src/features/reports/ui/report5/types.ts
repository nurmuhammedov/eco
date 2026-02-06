export interface Report5StatusItem {
  type: string
  allCount: number
  activeCount: number
  inactiveCount: number
  validCount: number
  expiredCount: number
  noDateCount: number
}

export interface Report5Item {
  regionName: string
  types: Report5StatusItem[]
}
