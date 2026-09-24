export interface Report5StatusItem {
  type?: string
  name?: string
  allCount: number
  activeCount: number
  inactiveCount: number
  validCount: number
  expiredCount: number
  noDateCount: number
  /** Organizations owning devices of this type */
  organizationCount?: number
}

export interface Report5Item {
  regionName: string
  types?: Report5StatusItem[]
  items?: Report5StatusItem[]
  /** Organizations owning any device; not the sum over types, one may own several kinds */
  allOrganizationCount?: number
}
