// src/widgets/application-modal/index.tsx
import React, { useEffect } from 'react';
import { CheckCircle, Download, FileText, Loader2 } from 'lucide-react';
import { ApplicationStep } from '../model/use-application-creation';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string | null;
  currentStep: ApplicationStep;
  isLoading: boolean;
  isPdfLoading: boolean;
  isSignLoading: boolean;
  isSubmitLoading: boolean;
  error: string | null;
  onEditForm: () => void;
  onSignDocument: () => void;
  onSubmitApplication: () => void;
  onDownloadDocument: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  currentStep,
  isLoading,
  isPdfLoading,
  isSignLoading,
  isSubmitLoading,
  error,
  onEditForm,
  onSignDocument,
  onSubmitApplication,
  onDownloadDocument,
}) => {
  // Imzolash muvaffaqiyatli bo'lgandan keyin Yuborish tugmasini avtomatik ko'rsatish
  useEffect(() => {
    if (currentStep === 'signed' && !isLoading) {
      // Tugmani ko'rsatish va fokusga olish logikasi bo'lishi mumkin
    }
  }, [currentStep, isLoading]);

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

    return (
      <div className="flex flex-col">
        <div className="relative w-full h-96 border overflow-hidden rounded-md bg-gray-50 mb-4">
          <iframe src={documentUrl} className="absolute inset-0 w-full h-full" title="Ariza hujjati" />
        </div>

        <div className="flex justify-center">
          <Button variant="outline" onClick={onDownloadDocument} className="text-primary" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Yuklab olish
          </Button>
        </div>
      </div>
    );
  };

  const renderButtons = () => {
    switch (currentStep) {
      case 'view':
        return (
          <>
            <Button variant="outline" onClick={onEditForm} disabled={isLoading}>
              O'zgartirish
            </Button>
            <Button onClick={onSignDocument} disabled={isLoading || !documentUrl} className="ml-2">
              {isSignLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Imzolanmoqda...
                </>
              ) : (
                'Imzolash'
              )}
            </Button>
          </>
        );
      case 'signed':
        return (
          <>
            <Button variant="outline" onClick={onEditForm} disabled={isLoading}>
              O'zgartirish
            </Button>
            <Button onClick={onSubmitApplication} disabled={isLoading} className="ml-2">
              {isSubmitLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yuborilmoqda...
                </>
              ) : (
                'Yuborish'
              )}
            </Button>
          </>
        );
      case 'submitted':
        return <Button onClick={onClose}>Yopish</Button>;
      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    switch (currentStep) {
      case 'view':
        return 'Ariza hujjati';
      case 'signed':
        return 'Imzolangan ariza';
      case 'submitted':
        return 'Ariza muvaffaqiyatli yuborildi';
      default:
        return 'Ariza';
    }
  };

  // Ariza holatiga qarab ikonkani ko'rsatish
  const renderStatusIcon = () => {
    if (currentStep === 'signed') {
      return (
        <div className="absolute top-4 right-4 bg-yellow-100 rounded-full p-2">
          <FileText className="h-5 w-5 text-yellow-600" />
        </div>
      );
    }

    if (currentStep === 'submitted') {
      return (
        <div className="absolute top-4 right-4 bg-green-100 rounded-full p-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl relative">
        {renderStatusIcon()}

        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentStep === 'signed' && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-800">
              Ariza imzolandi. Endi arizani yuborish uchun "Yuborish" tugmasini bosing.
            </AlertDescription>
          </Alert>
        )}

        {currentStep === 'submitted' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Ariza muvaffaqiyatli yuborildi</h3>
            <p className="text-sm text-gray-500 text-center">Ariza raqamingiz bilan tez orada siz bilan bog'lanamiz</p>
          </div>
        ) : (
          renderContent()
        )}

        <DialogFooter className="flex justify-end space-x-2">{renderButtons()}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
