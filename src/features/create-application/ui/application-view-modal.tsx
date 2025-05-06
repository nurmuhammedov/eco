import { Button } from '@/shared/components/ui/button';
import { Download, Loader2, PencilLine } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

interface ApplicationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  documentUrl: string | null;
  error: string | null;
  onClose: () => void;
  onEdit: () => void;
  onDownload: (url: string) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  isLoading,
  documentUrl,
  error,
  onClose,
  onEdit,
  onDownload,
}) => {
  const handleDownload = () => {
    if (documentUrl) {
      onDownload(documentUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium">АРИЗА</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Ариза яратилмоқда...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 font-medium mb-2">Хато юз берди</p>
            <p className="text-gray-700">{error}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Ёпиш
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !error && documentUrl && (
          <div className="flex flex-col">
            <div className="border rounded-md overflow-hidden h-96 mb-4">
              <iframe src={documentUrl} className="w-full h-full" title="Ariza hujjati" />
            </div>

            <DialogFooter className="flex justify-between sm:justify-end gap-3">
              <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
                <PencilLine size={16} />
                Ўзгартириш
              </Button>
              <Button onClick={handleDownload} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Download size={16} />
                Юклаб олиш
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
