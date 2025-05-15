import { useState } from 'react';
import { apiClient } from '@/shared/api';
import { SignatureSelect } from '../index';
import { getSignatureKeys } from '@/shared/lib';
import { Loader2, Signature } from 'lucide-react';
import { useSignatureClient } from '@/shared/hooks';
import { Button } from '@/shared/components/ui/button';
import { SignatureKey } from '@/shared/types/signature';
import { useDocumentSigning } from '@/shared/components/common/signature/model';
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

interface SignatureModalProps {
  formData: any;
  documentUrl: string;
  onCancel?: () => void;
  submitEndpoint: string;
  onConfirm?: (certificate: SignatureKey | null) => void;
}

export const SignatureModal = ({ onConfirm, onCancel, documentUrl, submitEndpoint, formData }: SignatureModalProps) => {
  const { Client } = useSignatureClient();
  const { signatureKeys } = getSignatureKeys();
  const [open, setOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<SignatureKey | null>(null);
  const { mutateAsync: signDocument, isPending } = useDocumentSigning();

  const handleSelectCertificate = (cert: SignatureKey) => {
    setSelectedCertificate(cert);
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      onConfirm(selectedCertificate);
    }
    await signDocument({
      Client,
      documentUrl,
      signature: selectedCertificate,
      onSuccess: (result) => {
        apiClient.post(submitEndpoint, { dto: formData, sign: result, filePath: documentUrl });
      },
    });
    setSelectedCertificate(null);
    setOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
    setSelectedCertificate(null);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Signature className="size-4" />
          Imzolash
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Elektron sertifikatni tanlang</AlertDialogTitle>
          <AlertDialogDescription>
            Imzolash uchun ERI sertifikatingizni tanlang. Bu amal orqali hujjat elektron imzolanadi va yuridik kuchga
            ega bo'ladi.
          </AlertDialogDescription>
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
          <AlertDialogCancel onClick={handleCancel}>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!selectedCertificate}
            className={!selectedCertificate ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Tasdiqlash
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
