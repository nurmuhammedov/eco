import React from 'react';
import { PDFViewer } from '@/features/view-pdf';
import { Button } from '@/shared/components/ui/button';
import { FileText, Loader2, Pencil } from 'lucide-react';
import { SignatureModal } from '@/shared/components/common/signature';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

interface ApplicationModalProps {
  formData: any;
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  submitEndpoint: string;
  isLoading: boolean;
  isPdfLoading: boolean;
  error: string | null;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  formData,
  isLoading,
  documentUrl,
  isPdfLoading,
  submitEndpoint,
  error,
}) => {
  const renderContent = () => {
    if (isPdfLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-center text-gray-600">PDF hujjati yaratilmoqda...</p>
        </div>
      );
    }

    if (!documentUrl) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-center text-gray-600">Hujjat topilmadi</p>
        </div>
      );
    }

    return <PDFViewer documentUrl={documentUrl} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[740px]">
        <DialogHeader>
          <DialogTitle className="flex items-end gap-x-2">
            <FileText className="h-5 w-5 text-yellow-600" /> Ariza hujjati
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderContent()}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <Pencil className="size-4" /> O'zgartirish
          </Button>
          <SignatureModal formData={formData} submitEndpoint={submitEndpoint} documentUrl={documentUrl} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
