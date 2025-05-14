import { useState } from 'react';
import { Signature } from 'lucide-react';
import { SignatureSelect } from '../index';
import { getSignatureKeys } from '@/shared/lib';
import { Button } from '@/shared/components/ui/button';
import { SignatureKey } from '@/shared/types/signature';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { axiosInstance } from '@/shared/api';
import { AxiosRequestConfig } from 'axios';
import { handleSendKey } from '@/shared/components/common/signature/model';
import { useSignatureClient } from '@/shared/hooks';

interface SignatureModalProps {
  title?: string;
  description?: string;
  onCancel?: () => void;
  cancelButtonText?: string;
  triggerButtonText?: string;
  continueButtonText?: string;
  onConfirm?: (certificate: SignatureKey | null) => void;
}

export const SignatureModal = ({
  title = 'Elektron sertifikatni tanlang',
  description = "Imzolash uchun ERI sertifikatingizni tanlang. Bu amal orqali hujjat elektron imzolanadi va yuridik kuchga ega bo'ladi.",
  triggerButtonText = 'Imzolash',
  continueButtonText = 'Tasdiqlash',
  cancelButtonText = 'Bekor qilish',
  onConfirm,
  onCancel,
}: SignatureModalProps) => {
  const { Client } = useSignatureClient();
  const { signatureKeys } = getSignatureKeys();
  const [selectedCertificate, setSelectedCertificate] = useState<SignatureKey | null>(null);
  const [open, setOpen] = useState(false);

  const handleSelectCertificate = (cert: SignatureKey) => {
    setSelectedCertificate(cert);
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      onConfirm(selectedCertificate);
    }
    await handleSendKey(Client, selectedCertificate);
    setOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
  };

  async function getBase64FromPdfUrl(pdfUrl: string): Promise<string | null> {
    try {
      const config: AxiosRequestConfig = {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
        },
        withCredentials: true,
      };

      const response = await axiosInstance.get(pdfUrl, config);

      if (response.status !== 200) {
        console.error(`Xatolik yuz berdi: ${response.status} - ${response.statusText}`);
        return null;
      }

      // Checking if `response.data` is an ArrayBuffer
      if (!response.data || typeof response.data.byteLength !== 'number') {
        console.error("PDF ma'lumotlari noto'g'ri formatda:", typeof response.data);
        console.error("PDF ma'lumotlar uzunligi:", response.data?.byteLength);
        return null;
      }

      // 5. Convert PDF to Base64 (Node.js environment)
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(response.data).toString('base64');
      }
      // Browser environment
      else {
        const uint8Array = new Uint8Array(response.data);
        let binaryString = '';
        const chunkSize = 16384; // Memory optimization

        // Processing large files into parts
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          binaryString += String.fromCharCode.apply(null, Array.from(chunk));
        }

        return btoa(binaryString);
      }
    } catch (error) {
      console.error('Error downloading PDF and converting to base64:', error);
      console.log('ERROR', error);
      return null;
    }
  }

  const res = getBase64FromPdfUrl('files/appeals/hf-appeals/2025/may/14/1747215624308.pdf');
  res.then((data) => console.log(data));
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Signature className="size-4" />
          {triggerButtonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <SignatureSelect onSelect={handleSelectCertificate} certificates={signatureKeys} />

          {selectedCertificate && (
            <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
              <p className="text-sm text-green-800">
                <span className="font-medium">Tanlangan sertifikat:</span> {selectedCertificate.CN}
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{cancelButtonText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!selectedCertificate}
            className={!selectedCertificate ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {continueButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
