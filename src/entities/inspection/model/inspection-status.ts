/**
 * The vocabulary the inspection pages and the widget around them share. It used
 * to sit inside the widget, so every page importing a status pulled the widget
 * in - and the widget imports those same pages.
 */
export enum InspectionStatus {
  ALL = 'ALL',
  NEW = 'NEW',
  NOTIFIED = 'NOTIFIED',
  ASSIGNED = 'ASSIGNED',
  NOT_SIGNED = 'NOT_SIGNED',
  TEN_DAYS = 'TEN_DAYS',
  /** Closed by the committee without being conducted */
  CLOSED = 'CLOSED',
  /** A tab, not a status: the open requests to close an inspection, split by their status */
  CLOSE_REQUESTS = 'CLOSE_REQUESTS',
}

export enum InspectionSubMenuStatus {
  CONDUCTED = 'CONDUCTED',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
}

export enum OtherInspectionTabStatus {
  ALL = 'ALL',
  ASSIGNED = 'ASSIGNED',
  CONDUCTED = 'CONDUCTED',
  CODE_ATTACHED = 'CODE_ATTACHED',
}

export interface CountDto {
  allCount: number
  newCount: number
  assignedCount: number
  notSignedCount: number
  conductedCount: number
  codeAttachedCount: number
  closedCount: number
}

export const defaultCountDto: CountDto = {
  allCount: 0,
  newCount: 0,
  notSignedCount: 0,
  assignedCount: 0,
  conductedCount: 0,
  codeAttachedCount: 0,
  closedCount: 0,
}
