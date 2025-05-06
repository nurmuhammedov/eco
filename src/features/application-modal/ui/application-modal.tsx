import React from 'react';
import { PDFViewer } from '@/features/view-pdf';
import { Button } from '@/shared/components/ui/button';
import { Download, Loader2, PencilLine } from 'lucide-react';
import { useApplicationModal } from '@/features/application-modal';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

interface ApplicationModalContentProps {
  isLoading: boolean;
  error: string | null;
  documentUrl: string | null;
  onClose: () => void;
  onEdit: () => void;
  onDownload: () => void;
}

// Modal content - Pure component
const ApplicationModalContent: React.FC<ApplicationModalContentProps> = ({
  isLoading,
  error,
  documentUrl,
  onClose,
  onEdit,
  onDownload,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Ариза яратилмоқда...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600 font-medium mb-2">Хато юз берди</p>
        <p className="text-gray-700">{error}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Ёпиш
          </Button>
        </div>
      </div>
    );
  }

  if (documentUrl) {
    return (
      <div className="flex flex-col">
        <div className="border rounded-md overflow-hidden h-96 mb-4">
          <PDFViewer url={documentUrl} />
        </div>

        <DialogFooter className="flex justify-between sm:justify-end gap-3">
          <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
            <PencilLine size={16} />
            Ўзгартириш
          </Button>
          <Button onClick={onDownload} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Download size={16} />
            Юклаб олиш
          </Button>
        </DialogFooter>
      </div>
    );
  }

  return null;
};

export const ApplicationModal: React.FC = () => {
  const { isOpen, isLoading, documentUrl, error, closeModal, resetModal, downloadDocument } = useApplicationModal();

  // Komponentni memorize qilish
  const modalContent = React.useMemo(() => {
    return (
      <ApplicationModalContent
        isLoading={isLoading}
        error={error}
        documentUrl={documentUrl}
        onClose={closeModal}
        onEdit={resetModal}
        onDownload={downloadDocument}
      />
    );
  }, [isLoading, error, documentUrl, closeModal, resetModal, downloadDocument]);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium">Ariza</DialogTitle>
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
};
