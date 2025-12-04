interface SignatureKey {
  CN: string
  O: string
  PINFL: string
  T: string
  TIN: string
  UID: string
  alias: string
  disk: string
  name: string
  path: string
  serialNumber: string
  type: string
  validFrom: Date | string
  validTo: Date | string
}

interface SignatureChallenge {
  challenge: string
  message: string
  pkcs7b64: string
  status: string
  ttl: number
}

interface SignatureCert {
  id: string
  cert: string
}

export interface SignatureClient {
  addApiKey: (domain: string, key: string) => void
  createPkcs7: (id: string, content: string) => Promise<string>
  getCertInfo: (cert: string) => Promise<void>
  getCertificateChain: (loadKeyId: string) => Promise<string[]>
  getMainCertificate: (loadKeyId: string) => Promise<string | null>
  getTimestampToken: (signature: string) => Promise<string>
  install: () => Promise<void>
  listAllUserKeys: () => Promise<SignatureKey[]>
  loadKey: (cert: SignatureKey) => Promise<SignatureCert>
  signPkcs7: (cert: SignatureCert, content: string) => Promise<string>
}

export type { SignatureKey, SignatureChallenge, SignatureCert }
