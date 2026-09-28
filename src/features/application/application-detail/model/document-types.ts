import type { UserLogsTypeEnum } from '@/entities/admin/user-logs/model/user-logs.enums'

import type { SignedDocument } from '@/entities/document'

export type { DocumentSigner, SignatureStatus } from '@/entities/document'

/** DocumentViewByRequest / DocumentViewByReply: a document attached to an appeal, by the applicant or in reply */
export interface ApplicationDocument extends SignedDocument {
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
