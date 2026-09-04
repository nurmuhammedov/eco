import { RegisterActiveTab } from '@/widgets/register/types'

/** Mirrors ReportChangeBelongType on the server. */
export const REPORT_CHANGE_BELONG_TYPE = {
  HF: 'HF',
  EQUIPMENT: 'EQUIPMENT',
  IRS: 'IRS',
  XRAY: 'XRAY',
} as const

/** Mirrors ReportChangeStatus on the server. */
export const REPORT_CHANGE_STATUS = {
  ALL: 'ALL',
  NEW: 'NEW',
  IN_PROCESS: 'IN_PROCESS',
  COMPLETED: 'COMPLETED',
} as const

export type ReportChangeBelongType = (typeof REPORT_CHANGE_BELONG_TYPE)[keyof typeof REPORT_CHANGE_BELONG_TYPE]
export type ReportChangeStatus = (typeof REPORT_CHANGE_STATUS)[keyof typeof REPORT_CHANGE_STATUS]

/**
 * Each registry tab keeps its sub-tab under a different key, and the change
 * requests one is what the report drills into - passing it leaves that tab
 * selected on arrival.
 */
const TAB_BY_BELONG_TYPE: Record<ReportChangeBelongType, { tab: string; subTabKey: string }> = {
  HF: { tab: RegisterActiveTab.HF, subTabKey: 'active' },
  EQUIPMENT: { tab: RegisterActiveTab.EQUIPMENTS, subTabKey: 'status' },
  IRS: { tab: RegisterActiveTab.IRS, subTabKey: 'valid' },
  XRAY: { tab: RegisterActiveTab.XRAY, subTabKey: 'status' },
}

interface ChangeReportLinkInput {
  belongType: ReportChangeBelongType
  status: ReportChangeStatus
  regionId?: number | string | null
}

/**
 * A count in the deregistration report stands for a set of objects, and the
 * registry can list exactly that set: the two report params replace the tab
 * row, so the page opens on the objects behind the number rather than on a
 * filter the reader has to reproduce by hand.
 *
 * Every column opens the registry section, the finished one included.
 */
export const buildChangeReportLink = ({ belongType, status, regionId }: ChangeReportLinkInput) => {
  const { tab, subTabKey } = TAB_BY_BELONG_TYPE[belongType]

  const params = new URLSearchParams({
    tab,
    [subTabKey]: 'CHANGED',
    reportChangeBelongType: belongType,
    reportChangeStatus: status,
  })

  if (regionId) params.set('regionId', String(regionId))

  return `/register?${params.toString()}`
}
