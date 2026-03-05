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
  showSignature?: boolean
  customAction?: React.ReactNode
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
  showSignature = true,
  customAction,
}) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  }, [])

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
      <DialogContent className="flex h-full max-h-[95vh] w-[740px] max-w-[98vw] flex-col gap-0 p-0 md:h-[1000px]">
        <DialogHeader className="flex-shrink-0 border-b p-4 md:p-6 md:pb-4">
          <DialogTitle className="flex items-end gap-x-2 text-base md:text-lg">
            <FileText className="h-5 w-5 text-yellow-600" /> {title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden bg-gray-50">{renderContent()}</div>

        <DialogFooter className="flex-shrink-0 flex-col gap-2 border-t bg-white p-4 md:flex-row md:p-6 md:pt-4">
          <div className="flex w-full flex-col gap-2 md:flex-row md:items-end">
            {isMobile && documentUrl && (
              <Button variant="outline" className="w-full md:w-auto" onClick={() => window.open(documentUrl, '_blank')}>
                <FileText className="mr-2 size-4" /> Hujjatni ko‘rish
              </Button>
            )}
            <Button variant="outline" className="w-full md:w-auto" onClick={onClose} disabled={isLoading}>
              <Pencil className="mr-2 size-4" /> Hujjatni o‘zgartirish
            </Button>
          </div>

          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            {showSignature && (
              <SignatureModal
                error={error}
                isLoading={isLoading}
                documentUrl={documentUrl}
                submitApplicationMetaData={submitApplicationMetaData}
              />
            )}
            {customAction}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
