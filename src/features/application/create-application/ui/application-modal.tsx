import { PDFViewer } from '@/features/view-pdf' // Yo'lni loyihangizga moslang
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

    // O'ZGARISH: PDFViewer ga h-full berildi
    return <PDFViewer documentUrl={documentUrl} className="h-full" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* O'ZGARISH:
         1. h-[95vh]: Modal balandligi ekranning 95 foizini egallaydi.
         2. flex flex-col: Ichki elementlarni vertikal joylashtirish uchun.
      */}
      <DialogContent className="flex h-[1000px] max-h-[95vh] w-[740px] max-w-[98vw] flex-col gap-0 p-0">
        <DialogHeader className="flex-shrink-0 border-b p-6 pb-4">
          <DialogTitle className="flex items-end gap-x-2">
            <FileText className="h-5 w-5 text-yellow-600" /> {title}
          </DialogTitle>
        </DialogHeader>

        {/*{error && (*/}
        {/*  <div className="flex-shrink-0 px-6 pt-4">*/}
        {/*    <Alert variant="destructive" className="mb-4">*/}
        {/*      <AlertDescription>{error}</AlertDescription>*/}
        {/*    </Alert>*/}
        {/*  </div>*/}
        {/*)}*/}

        {/* O'ZGARISH:
           1. flex-1: Bo'sh qolgan barcha joyni egallaydi.
           2. overflow-hidden: Agar PDF katta bo'lsa, modal cho'zilib ketmaydi, ichki qism chegaralanadi.
           3. relative: Ichki elementlar (PDF) to'g'ri joylashishi uchun.
        */}
        <div className="relative flex-1 overflow-hidden bg-gray-50">{renderContent()}</div>

        {/* Footer - qotib turadi (flex-shrink-0) */}
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
