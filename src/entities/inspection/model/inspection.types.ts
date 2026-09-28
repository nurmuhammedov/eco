import type { SignedDocument } from '@/entities/document'

/** What an inspection can be of */
export type InspectionObjectType = 'HF' | 'ELEVATOR' | 'ATTRACTION' | 'IRS' | 'XRAY' | 'LPG_POWERED'

/** InspectionCustom: one row of the inspections list */
export interface Inspection {
  id: string
  createdAt: string | null
  tin: number | null
  regionName: string | null
  districtName: string | null
  legalName: string | null
  legalAddress: string | null
  actDate: string | null
}

/** InspectorShortInfo */
export interface InspectorShortInfo {
  id: string
  name: string | null
}

/** PostalMailStatus: where the hybrid mail with the notification letter is */
export type PostalMailStatus =
  | 'SENT_TO_POST'
  | 'INSUFFICIENT_FUNDS'
  | 'SENT_TO_CLIENT'
  | 'RECEIVED_BY_CLIENT'
  | 'UNKNOWN'

/** InspectionFullDto (`GET /inspections/{id}`) */
export interface InspectionDetail {
  id: string
  startDate: string | null
  endDate: string | null
  status: string | null
  specialCode: string | null
  decree: SignedDocument | null
  decreeNumber: string | null
  notificationLetterPath: string | null
  notificationLetterDate: string | null
  inspectors: InspectorShortInfo[] | null
  notificationLetterId: string | null
  notificationLetterStatus: PostalMailStatus | null
}

/** InspectionResultStatus */
export type InspectionResultStatus = 'NEW' | 'ASSIGNED' | 'COMPLETED'

/** InspectionResultRes (`GET /inspection-results`): one object checked by an inspection */
export interface InspectionResult {
  id: string
  act: SignedDocument | null
  belongType: InspectionObjectType | null
  belongName: string | null
  belongRegistryNumber: string | null
  belongId: string | null
  status: InspectionResultStatus | null
  acknowledgementPath: string | null
  specialCode: string | null
  signedActPath: string | null
  additionalFilePath: string | null
  explanationLetterPath: string | null
  reportPath: string | null
  familiarizationReportPath: string | null
}

/** InspectionResultResByDecree: an object an inspection covers, before the decree assigns it */
export interface InspectionObject {
  id: string
  belongName: string | null
  belongRegistryNumber: string | null
  belongType: InspectionObjectType | null
  specialCode: string | null
  riskAnalysisId: string | null
}

/** `GET /inspections/{id}/objects`: the objects grouped by kind */
export type InspectionObjectsByType = Partial<Record<InspectionObjectType, InspectionObject[]>>

/** RiskAnalysisViewByInspection */
export interface InspectionRiskAnalysis {
  id: string
  registryNumber: string | null
  totalScore: number | null
  address: string | null
  name: string | null
  startDate: string | null
  endDate: string | null
  type: string | null
}

/** InspectionExecutionRes: a file the inspector sent as the execution of a checklist item */
export interface InspectionExecution {
  id: string
  filePath: string | null
  uploadDate: string | null
  rejectedReason: string | null
  status: 'REJECTED' | 'ACCEPTED' | null
}

/** InspectionNoticeType */
export type InspectionNoticeType = 'NOTIFIED' | 'AFTER_24_HOURS'

/** OtherInspectionRes: one row of the other-inspections list */
export interface OtherInspection {
  id: string
  startDate: string | null
  endDate: string | null
  noticeType: InspectionNoticeType | null
  legalName: string | null
  legalTin: number | null
  objectAddress: string | null
  specialCode: string | null
  status: string | null
  actDate: string | null
}

/** OtherInspectionResById (`GET /inspections/other/{id}`) */
export interface OtherInspectionDetail {
  id: string
  legalName: string | null
  legalTin: number | null
  belongType: InspectionObjectType | null
  belongId: string | null
  programPath: string | null
  startDate: string | null
  endDate: string | null
  inspectors: InspectorShortInfo[] | null
  decree: SignedDocument | null
  decreeNumber: string | null
  noticeType: InspectionNoticeType | null
  specialCode: string | null
  status: string | null
}

/** ChecklistIssueStatus: where a shortcoming found by the inspection stands */
export type ChecklistIssueStatus = 'NEGATIVE' | 'UPLOADED' | 'REJECTED' | 'ACCEPTED' | 'EXPIRED'

/** ChecklistAnswer */
export type ChecklistAnswer = 'POSITIVE' | 'NEGATIVE' | 'UNRELATED'

/** InspectionChecklistRes: one question of a checklist, with the inspector's answer */
export interface InspectionChecklistItem {
  id: string
  orderNumber: number | null
  question: string | null
  answer: ChecklistAnswer | null
  deadline: string | null
  corrective: string | null
  status: ChecklistIssueStatus | null
  basisPath: string | null
  description: string | null
}

/** InspectionCategoryRes (`GET /inspection-checklists`): the questions of one checklist category */
export interface InspectionChecklistCategory {
  categoryName: string | null
  inspectionCategoryId: string
  checklists: InspectionChecklistItem[] | null
}
