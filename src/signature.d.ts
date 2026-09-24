declare module '@/shared/config/signature/e-imzo-init.js' {
  import type { SignatureClient } from '@/shared/types/signature'

  const Signature: { new (): SignatureClient }
  type Signature = SignatureClient
  export default Signature
}
