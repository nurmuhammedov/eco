/** DocumentSignatureStatus: the signer signed the document or turned it down */
export type SignatureStatus = 'APPROVED' | 'REJECTED'

/** SignerView */
export interface DocumentSigner {
  signedBy: string | null
  createdAt: string | null
  signerUserId: string | null
  status: SignatureStatus | null
}

/** DocumentRes: a document drawn up in the system, with who has signed it */
export interface SignedDocument {
  documentId: string | null
  createdAt: string | null
  documentType: string | null
  isFullySigned: boolean | null
  path: string | null
  signers: DocumentSigner[] | null
}
