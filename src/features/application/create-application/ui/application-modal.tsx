import { PDFViewer } from '@/features/view-pdf'
import { SignatureModal } from '@/shared/components/common/signature'
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
          <p className="text-center text-gray-600">Hujjat topilmadi!</p>
        </div>
      )
    }

    return <PDFViewer documentUrl={documentUrl} className="h-full" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[1000px] max-h-[95vh] w-[740px] max-w-[98vw] flex-col gap-0 p-0">
        <DialogHeader className="flex-shrink-0 border-b p-6 pb-4">
          <DialogTitle className="flex items-end gap-x-2">
            <FileText className="h-5 w-5 text-yellow-600" /> {title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden bg-gray-50">{renderContent()}</div>

        <DialogFooter className="flex-shrink-0 border-t bg-white p-6 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <Pencil className="mr-2 size-4" /> Hujjatni o‘zgartirish
          </Button>
          <SignatureModal
            error={error}
            isLoading={isLoading}
            documentUrl={documentUrl}
            submitApplicationMetaData={submitApplicationMetaData}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
