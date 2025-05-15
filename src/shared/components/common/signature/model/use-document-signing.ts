import { toast } from 'sonner';
import { apiClient } from '@/shared/api';
import { SignatureClient, SignatureKey } from '@/shared/types/signature';
import { convertPdfToBase64 } from '@/shared/components/common/signature/model';
import { getTimeStamp } from '@/shared/components/common/signature/api/get-time-stamp';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface SignDocumentParams {
  documentUrl: string;
  Client: SignatureClient;
  signature: SignatureKey | null;
  onSuccess?: (result: any) => void; // Muvaffaqiyatli yakunlanganda callback
}

export function useDocumentSigning() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signDocumentWithMetadata,
    onSuccess: (result, variables) => {
      console.log('onsuccess result', result);
      toast.success('Hujjat muvaffaqiyatli imzolandi!');

      // Cache ni yangilash
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      // Agar callback berilgan bo'lsa, uni chaqirish
      if (variables.onSuccess) {
        variables.onSuccess(result);
      }
    },
    onError: (error) => {
      toast.error(error.message, { richColors: true });
      console.error('Imzolash xatoligi:', error);
    },
  });
}

export const signDocumentWithMetadata = async ({ Client, signature, documentUrl = '' }: SignDocumentParams) => {
  try {
    // 1. Load certificate key
    if (!signature) {
      toast.error('Imzolash kaliti topilmadi');
      return false;
    }

    const keyResponse = await Client.loadKey(signature as unknown as SignatureKey);
    const keyId = keyResponse?.id;

    if (!keyId) {
      toast.error('Kalit ID si olinmadi');
      return false;
    }

    // 2. Convert PDF to base64
    const documentBase64 = await convertPdfToBase64(documentUrl);
    if (!documentBase64) {
      toast.error('Hujjat yuklanmadi');
      return false;
    }

    // 3. Create a new PKCS7
    const pkcs7Signature = await Client.createPkcs7(keyId, documentBase64);
    if (!pkcs7Signature) {
      toast.error('Hujjat imzolashda xatolik');
      return false;
    }

    // 4. Fetch timestamp
    const timestampResponse = await getTimeStamp({ sign: pkcs7Signature });
    const { pkcs7b64, status } = timestampResponse;

    if (status !== '1' || !pkcs7b64) {
      toast.error('Vaqt belgisi (timestamp) olishda xatolik');
      return false;
    }

    // 5. Send to server
    const signatureResponse = await apiClient.post('/e-imzo/attached', { sign: pkcs7b64 });

    if (signatureResponse.status !== 200) {
      toast.error('Imzo serverga yuborishda xatolik');
      return false;
    }

    // const serverResponse = await apiClient.post(options.submitEndpoint, {
    //   sign: pkcs7b64,
    //   filePath: documentUrl,
    //   dto: options.formData,
    // });

    // if (signatureResponse.status === 200) {
    //   toast.success('Hujjat imzolandi!');
    //   return true;
    // } else {
    //   toast.error('Server javobida xatolik');
    //   return false;
    // }
    return pkcs7b64;
  } catch (error) {
    const errorMessage = getReadableErrorMessage(error);
    toast.error(errorMessage);
    console.error('Imzolash xatoligi:', error);
    return false;
  }
};

function getReadableErrorMessage(error: unknown): string {
  if (!error) return "Noma'lum xatolik";

  if (typeof error === 'object') {
    // Axios xatoligi
    if ('response' in error && error.response) {
      const response = error.response as any;

      // Backend dan xabar kelgan bo'lsa
      if (response.data?.message) {
        return response.data.message;
      }
      // Status kodga qarab
      if (response.status === 401) {
        return 'Avtorizatsiya xatoligi';
      }
      if (response.status === 403) {
        return 'Ruxsat etilmagan amal';
      }
      if (response.status === 404) {
        return "So'ralgan resurs topilmadi";
      }
      if (response.status >= 500) {
        return "Server xatoligi. Iltimos keyinroq urinib ko'ring";
      }

      return `Server xatoligi: ${response.status}`;
    }

    // E-imzo xatoliklari
    if ('message' in error) {
      const message = (error as Error).message;
      if (message.includes('password')) {
        return "Parol noto'g'ri kiritildi!";
      }
      if (message.includes('key') || message.includes('kalit')) {
        return "Kalit bilan bog'liq muammo yuzaga keldi";
      }

      return message;
    }
  }

  // Oddiy string xatoliklar
  if (typeof error === 'string') {
    return error;
  }

  return "Noma'lum xatolik yuz berdi";
}
