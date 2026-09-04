/** Ionizing radiation sources carry no expiry - the registry only knows whether one is still valid. */
export interface IrsCount {
  allCount: number
  activeCount: number
  inactiveCount: number
}

export interface XRayCount {
  allCount: number
  activeCount: number
  inactiveCount: number
  validCount: number
  expiredCount: number
  noDateCount: number
}

export interface IrsXrayStatusItem {
  regionName: string
  irs: IrsCount | null
  xray: XRayCount | null
}
