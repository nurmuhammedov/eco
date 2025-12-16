import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useSignatureClient } from '@/shared/hooks'

export function getSignatureKeys() {
  const { Client, isScriptLoaded } = useSignatureClient()
  const [signatureKeys, setSignatureKeys] = useState([])
  const [isCKCPLuggedIn, setIsCKCPLuggedIn] = useState<boolean>(false)

  useEffect(() => {
    if (isScriptLoaded) {
      Client.install()
        .then(() => {
          Client.listAllUserKeys()
            .then((res: any) => setSignatureKeys(res))
            .catch(() => toast.error('Error connecting to E-IMZO'))
          Client.isCKCPLuggedIn()
            .then((res: any) => setIsCKCPLuggedIn(res))
            .catch(() => toast.error('Error connecting to E-IMZO'))
        })
        .catch(() => toast.error('Error connecting to E-IMZO'))
    }
  }, [isScriptLoaded])

  return { signatureKeys, isCKCPLuggedIn }
}
