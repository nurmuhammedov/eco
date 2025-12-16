import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'

import Signature from '@/shared/config/signature/e-imzo-init.js'
import SignatureScript from '@/shared/config/signature/e-imzo.js?raw'

export function useSignatureClient() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const Client: Signature = useMemo(() => new Signature(), [])

  useEffect(() => {
    const scriptContent = SignatureScript
    const script = document.createElement('script')
    script.id = 'signature-script'
    script.type = 'text/javascript'
    script.text = scriptContent
    document.head.appendChild(script)
    setIsScriptLoaded(true)

    script.onerror = () => toast.error('Error loading E-imzo script')
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return { isScriptLoaded, Client }
}
