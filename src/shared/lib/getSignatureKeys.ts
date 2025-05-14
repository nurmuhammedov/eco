import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useSignature } from '@/shared/hooks';

export function getSignatureKeys() {
  const { Client, isScriptLoaded } = useSignatureClient();
  const [signatureKeys, setSignatureKeys] = useState([]);

  useEffect(() => {
    if (isScriptLoaded) {
      Client.install()
        .then(() => {
          Client.listAllUserKeys()
            .then((res: any) => setSignatureKeys(res))
            .catch(() => toast.error('Error connecting to E-IMZO'));
        })
        .catch(() => toast.error('Error connecting to E-IMZO'));
    }
  }, [isScriptLoaded]);

  return { signatureKeys };
}
