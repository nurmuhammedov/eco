export enum ChecklistAnswerStatus {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  UNRELATED = 'UNRELATED',
}

/** InspectionChecklistDto: one question's answer as it is sent */
export interface ChecklistAnswerDto {
  inspectionChecklistId: string
  answer?: ChecklistAnswerStatus
  corrective: string | null
  deadline: string | null
  basisPath: string | null
  description: string | null
}
