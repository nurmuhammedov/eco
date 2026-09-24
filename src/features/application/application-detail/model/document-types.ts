import type { UserLogsTypeEnum } from '@/entities/admin/user-logs/model/user-logs.enums'

export interface DocumentSigner {
  id?: string
  signedBy: string
  isSigned: boolean
  createdAt: string
}

/** A document attached to an application, by the applicant or in reply */
export interface ApplicationDocument {
  id?: string
  createdAt: string
  documentType: string
  isFullySigned: boolean
  signers: DocumentSigner[]
  path?: string
}

/** One step in an application's (or a registry change's) execution history */
export interface ExecutionLog {
  id?: string
  executorName?: string
  status: UserLogsTypeEnum | null
  createdAt?: string
  description?: string | null
}
