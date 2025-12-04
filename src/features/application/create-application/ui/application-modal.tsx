import { PDFViewer } from '@/features/view-pdf'
import { SignatureModal } from '@/shared/components/common/signature'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { FileText, Loader2, Pencil } from 'lucide-react'
import React from 'react'

interface ApplicationModalProps {
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  documentUrl: string
  error: string | null
  isPdfLoading: boolean
  submitApplicationMetaData: (sign: string) => void
  title?: string
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  error,
  isOpen,
  onClose,
  isLoading,
  documentUrl,
  isPdfLoading,
  submitApplicationMetaData,
  title = 'Hujjatni shakklantirish',
}) => {
  const renderContent = () => {
    if (isPdfLoading) {
      return (
        <div className="flex h-full flex-col items-center justify-center py-8">
          <Loader2 className="text-primary mb-4 size-8 animate-spin" />
          <p className="text-center text-gray-600">PDF hujjati yaratilmoqda...</p>
        </div>
      )
    }

    if (!documentUrl) {
      return (
        <div className="flex h-full flex-col items-center justify-center py-8">
          <p className="text-center text-gray-600">Hujjat topilmadi</p>
        </div>
      )
    }

    return <PDFViewer documentUrl={documentUrl} />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[98vh] w-[740px] max-w-[98vw] flex-col p-0">
        <DialogHeader className="flex-shrink-0 border-b p-6 pb-4">
          <DialogTitle className="flex items-end gap-x-2">
            <FileText className="h-5 w-5 text-yellow-600" /> {title}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="flex-shrink-0 px-6 pt-4">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4">{renderContent()}</div>

        <DialogFooter className="flex-shrink-0 border-t p-6 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <Pencil className="size-4" /> O'zgartirish
          </Button>
          <SignatureModal
            isLoading={isLoading}
            documentUrl={documentUrl}
            submitApplicationMetaData={submitApplicationMetaData}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
