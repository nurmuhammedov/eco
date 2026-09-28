import type { AccreditationStatus, ExpertiseTypeEnum } from './constants'

export type ConclusionProcessStatus = 'NEW' | 'COMPLETED'

/** ConclusionPeriodType: a declaration filed in this system or brought over from paper */
export type ConclusionPeriodType = 'CURRENT' | 'OLD'

/** ConclusionRes (`GET /conclusions`) */
export interface ConclusionRow {
  id: string
  legalName: string | null
  legalTin: number | null
  customerName: string | null
  customerTin: number | null
  objectName: string | null
  registryNumber: string | null
  type: ExpertiseTypeEnum | null
  registrationDate: string | null
  processStatus: ConclusionProcessStatus | null
  filePath: string | null
  createdDate: string | null
  expertiseName: string | null
  address: string | null
  periodType: ConclusionPeriodType | null
  result: boolean | null
}

/**
 * ConclusionResById (`GET /conclusions/{id}`). An old declaration keeps its
 * conclusion number, date and file in `registryNumber`, `registrationDate`
 * and `filePath` too.
 */
export interface ConclusionDetail {
  id: string
  registryNumber: string | null
  legalTin: number | null
  accreditationRegistryNumber: string | null
  customerTin: number | null
  customerPhoneNumber: string | null
  address: string | null
  objectName: string | null
  type: ExpertiseTypeEnum | null
  result: boolean | null
  registrationDate: string | null
  filePath: string | null
  processStatus: ConclusionProcessStatus | null
  active: boolean | null
  cancelledReason: string | null
  cancelledDate: string | null
  regionId: number | null
  districtId: number | null
  hfId: string | null
  expertiseName: string | null
  createdDate: string | null
  declarationFilePath: string | null
  calculationLetterPath: string | null
  informationNotePath: string | null
  declarationRegistryNumber: string | null
  declarationRegistrationDate: string | null
  periodType: ConclusionPeriodType | null
}

/** ConclusionCount (`GET /conclusions/count`), named the way Jackson writes its getters */
export interface ConclusionCount {
  allCount: number | null
  lhcount: number | null
  tqcount: number | null
  bicount: number | null
  xdcount: number | null
  ixcount: number | null
}

/** ConclusionDto (`POST /conclusions`) */
export interface ConclusionPayload {
  customerTin: number
  customerPhoneNumber: string
  hfId: string | null
  regionId: number
  districtId: number
  address: string
  expertiseName: string
  objectName: string
  type: ExpertiseTypeEnum
  declarationFilePath?: string
  calculationLetterPath?: string
  informationNotePath?: string
}

/** OldConclusionDto (`POST /conclusions/old`) */
export interface OldConclusionPayload
  extends Omit<ConclusionPayload, 'declarationFilePath' | 'calculationLetterPath' | 'informationNotePath'> {
  conclusionFilePath: string
  declarationFilePath: string
  calculationLetterPath: string
  informationNotePath: string
  conclusionRegistryNumber: string
  declarationRegistryNumber: string
  declarationRegistrationDate: string
  conclusionRegistrationDate: string
}

/** AccreditationRes (`GET /accreditations`) */
export interface AccreditationRow {
  id: number
  legalName: string | null
  legalTin: number | null
  address: string | null
  registryNumber: string | null
  registrationDate: string | null
  expiryDate: string | null
  status: AccreditationStatus | null
  givenNumber: string | null
}

/** AccreditationResByActive (`GET /accreditations/active`) */
export interface ActiveExpert {
  id: number
  legalName: string | null
  legalTin: number | null
}

/** ConclusionViewBySelect (`GET /conclusions/select`) */
export interface ConclusionOption {
  id: string
  registryNumber: string | null
}
