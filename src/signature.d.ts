declare module '@/shared/config/signature/e-imzo-init.js' {
  export default class {
    addApiKey: (domain: string, key: string) => void
    createPkcs7: (id: string, content: string) => Promise<string>
    getCertInfo: (cert: string) => Promise<void>
    getCertificateChain: (loadKeyId: string) => Promise<string[]>
    getMainCertificate: (loadKeyId: string) => Promise<string | null>
    getTimestampToken: (signature: string) => Promise<string>
    install: () => Promise<void>
    listAllUserKeys: () => Promise<any[]>
    isCKCPLuggedIn: () => Promise<any[]>
    loadKey: (cert: SignatureKey) => Promise<any>
    signPkcs7: (cert: SignatureCert, content: string) => Promise<string>
    constructor()
  }
}
