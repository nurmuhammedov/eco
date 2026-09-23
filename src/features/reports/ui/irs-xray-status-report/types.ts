/** Ionizing radiation sources carry no expiry - the registry only knows whether one is still valid. */
/** Organizations that own the devices, split by whether they belong to the state */
export interface OrganizationCount {
  allCount: number
  stateCount: number
  nonStateCount: number
}

export interface IrsCount {
  allCount: number
  activeCount: number
  inactiveCount: number
  organization?: OrganizationCount | null
}

export interface XRayCount {
  allCount: number
  activeCount: number
  inactiveCount: number
  validCount: number
  expiredCount: number
  noDateCount: number
  organization?: OrganizationCount | null
}

export interface IrsXrayStatusItem {
  regionName: string
  irs: IrsCount | null
  xray: XRayCount | null
}
