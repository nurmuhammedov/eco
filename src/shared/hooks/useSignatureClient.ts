// ** React and sonner imports
import { toast } from 'sonner';
import { useEffect, useMemo, useState } from 'react';

// ** E-imzo client imports
import SignatureClient from '@/shared/config/signature/Eimzo.js';
import SignatureScript from '@/shared/config/signature/e-imzo.js?raw';

export function useSignatureClient() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const Client = useMemo(() => new SignatureClient(), []);

  useEffect(() => {
    const scriptContent = SignatureScript;
    const script = document.createElement('script');
    script.id = 'signature-script';
    script.type = 'text/javascript';
    script.text = scriptContent;
    document.head.appendChild(script);
    setIsScriptLoaded(true);

    script.onerror = () => toast.error('Error loading E-imzo script');
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return { isScriptLoaded, Client };
}
