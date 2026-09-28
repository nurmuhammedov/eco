import type { InquiryAction, InquiryBelongType, InquiryResult, InquiryStatus, InquiryType } from './types'

/** Inquiry (`GET /inquiries` lists the records themselves) */
export interface InquiryRow {
  id: string
  registryNumber: string | null
  belongId: string | null
  belongType: InquiryBelongType | null
  type: InquiryType | null
  fullName: string | null
  phoneNumber: string | null
  message: string | null
  filePathList: string[] | null
  ownerProfileId: string | null
  ownerIdentity: number | null
  regionId: number | null
  location: string | null
  occurredAt: string | null
  status: InquiryStatus | null
  result: InquiryResult | null
  executorUserId: string | null
  executorName: string | null
  rewardAmount: number | null
  imposedFineAmount: number | null
  withholdingAmount: number | null
  transferFineAmount: number | null
  recoveredAmount: number | null
  isMib: boolean | null
  paidRewardAmount: number | null
  initialExecutionFilePath: string | null
  courtExecutionFilePath: string | null
  paymentExecutionFilePath: string | null
  executionMessage: string | null
  createdAt: string | null
}

/** InquiryRestDto (`GET /inquiries/{id}`) */
export interface InquiryDetail extends InquiryRow {
  ownerName: string | null
  regionName: string | null
  /** Not in InquiryRestDto: the backend does not send it yet */
  rejectReason?: string | null
  /** Not in InquiryRestDto: the backend does not send it yet */
  action?: InquiryAction | null
}

/** PlasticCardResDto (`GET /plastic-cards/by-inquiry/{id}`): where the reward is paid */
export interface InquiryPlasticCard {
  id: string
  cardNumber: string | null
  expirationDate: string | null
  transitAccount: string | null
  bankInfo: string | null
}

/** InquiryInitialExecutionDto */
export interface InquiryInitialExecution {
  type?: InquiryType
  action?: InquiryAction
  initialExecutionFilePath?: string
  message?: string
}

/** InquiryCourtExecutionDto */
export interface InquiryCourtExecution {
  isPositive: boolean
  courtExecutionFilePath: string
  message?: string
  imposedFineAmount: number | null
}

/** InquiryDto (`POST /public/inquiries`) */
export interface InquiryPayload {
  belongId?: string
  belongType?: InquiryBelongType
  type: InquiryType
  message: string
  regionId: number
  fullName?: string
  phoneNumber?: string
  filePathList?: string[]
  location?: string
  occurredAt?: string
}
