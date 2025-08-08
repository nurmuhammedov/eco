import { apiConfig } from '@/shared/api/constants';
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
import { Button } from '@/shared/components/ui/button';
import { useSignatureClient } from '@/shared/hooks';
import { getSignatureKeys } from '@/shared/lib';
import { SignatureKey } from '@/shared/types/signature';
import { Loader2, Signature } from 'lucide-react';
import { useState } from 'react';
import { SignatureSelect } from '../index';

interface SignatureModalProps {
  isLoading: boolean;
  documentUrl: string;
  onCancel?: () => void;
  submitApplicationMetaData: (sign: string) => void;
  onConfirm?: (certificate: SignatureKey | null) => void;
}

export const SignatureModal = ({
  onCancel,
  onConfirm,
  isLoading,
  documentUrl,
  submitApplicationMetaData,
}: SignatureModalProps) => {
  const { Client } = useSignatureClient();
  const { signatureKeys } = getSignatureKeys();
  const [open, setOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<SignatureKey | null>(null);
  const { mutateAsync: signDocument, isPending } = useDocumentSigning();

  const isLoadingSignature = isLoading || isPending;

  const handleSelectCertificate = (cert: SignatureKey) => {
    setSelectedCertificate(cert);
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      onConfirm(selectedCertificate);
    }

    if (apiConfig.oneIdClientId == 'test_cirns_uz') {
      submitApplicationMetaData('singString');
    } else {
      await signDocument({
        Client,
        documentUrl,
        signature: selectedCertificate,
        onSuccess: (result) => submitApplicationMetaData(result),
      });
    }
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
        <Button loading={isLoading} disabled={isLoadingSignature}>
          <Signature className="size-4" />
          Imzolash
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Elektron kalitni tanlang</AlertDialogTitle>
          <AlertDialogDescription>
            Imzolash uchun ERI kalitingizni tanlang. Bu amal orqali hujjat elektron tarzda imzolanadi va yuridik kuchga
            ega bo'ladi.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <SignatureSelect onSelect={handleSelectCertificate} certificates={signatureKeys} />

          {selectedCertificate && (
            <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
              <p className="text-sm text-green-800">
                <span className="font-medium">Tanlangan kalit:</span> {selectedCertificate.CN}
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!selectedCertificate && apiConfig.oneIdClientId != 'test_cirns_uz'}
            className={
              !selectedCertificate && apiConfig.oneIdClientId != 'test_cirns_uz' ? 'opacity-50 cursor-not-allowed' : ''
            }
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Tasdiqlash
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
