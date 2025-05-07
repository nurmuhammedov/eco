import { Button } from '@/shared/components/ui/button';
import { CheckCircle, Download, Loader2, PencilLine, SendIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

interface ApplicationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  isPdfLoading?: boolean;
  isSignLoading?: boolean;
  isSubmitLoading?: boolean;
  step: 'view' | 'signed' | 'submitted';
  error: string | null;
  documentUrl: string | null;
  onSign: () => void;
  onSubmit: () => void;
  onEdit: () => void;
  onClose: () => void;
  onDownload: () => void;
}

export function ApplicationModal({
  isOpen,
  isLoading,
  step,
  error,
  documentUrl,
  onSign,
  onSubmit,
  onEdit,
  onClose,
  onDownload,
}: ApplicationModalProps) {
  if (!isOpen) return null;

  // Xatolik holati
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Хатолик</DialogTitle>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 p-4 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Ёпиш</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Yuklash holati
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-8">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-3" />
            <p>Илтимос кутинг...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // PDF ko'rish holati
  if (step === 'view' && documentUrl) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ариза</DialogTitle>
          </DialogHeader>

          <div className="border rounded-md overflow-hidden h-96">
            <iframe src={documentUrl} className="w-full h-full" title="Ariza" />
          </div>

          <DialogFooter className="flex justify-between gap-2 sm:justify-end">
            <Button variant="outline" onClick={onEdit}>
              <PencilLine className="mr-2 h-4 w-4" />
              Ўзгартириш
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Юклаб олиш
              </Button>

              <Button onClick={onSign}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Имзолаш
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Imzolangan holat
  if (step === 'signed') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Имзоланган ариза</DialogTitle>
          </DialogHeader>

          <div className="bg-green-50 border border-green-200 p-4 rounded-md">
            <p className="text-green-700">Ҳужжат муваффақиятли имзоланди</p>
          </div>

          <DialogFooter>
            <Button onClick={onSubmit}>
              <SendIcon className="mr-2 h-4 w-4" />
              Аризани юбориш
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Yuborilgan holat
  if (step === 'submitted') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ариза юборилди</DialogTitle>
          </DialogHeader>

          <div className="bg-green-50 border border-green-200 p-4 rounded-md text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-green-700 font-medium">Ариза муваффақиятли юборилди</p>
          </div>

          <DialogFooter>
            <Button onClick={onClose}>Ёпиш</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
