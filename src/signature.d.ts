declare module '@/shared/config/signature/Eimzo.js' {
  import { SignatureCert, SignatureKey } from '@app/interfaces'
  export default class {
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

    constructor()
  }
}
