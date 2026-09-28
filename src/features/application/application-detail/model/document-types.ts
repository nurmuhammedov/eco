import type { UserLogsTypeEnum } from '@/entities/admin/user-logs/model/user-logs.enums'

/** DocumentSignatureStatus: the signer signed the document or turned it down */
export type SignatureStatus = 'APPROVED' | 'REJECTED'

/** SignerView */
export interface DocumentSigner {
  signedBy: string | null
  createdAt: string | null
  signerUserId: string | null
  status: SignatureStatus | null
}

/** DocumentViewByRequest / DocumentViewByReply: a document attached to an appeal, by the applicant or in reply */
export interface ApplicationDocument {
  documentId: string | null
  createdAt: string | null
  documentType: string | null
  isFullySigned: boolean | null
  path: string | null
  signers: DocumentSigner[] | null
  /** A reply's verdict from the head: AGREED, APPROVED, NOT_AGREED, NOT_APPROVED */
  agreementStatus?: string | null
  /** Why a reply was turned down */
  description?: string | null
}

/** One step in an application's (or a registry change's) execution history */
export interface ExecutionLog {
  id?: string
  executorName?: string
  status: UserLogsTypeEnum | null
  createdAt?: string
  description?: string | null
}
