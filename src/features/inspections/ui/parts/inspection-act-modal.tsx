import { FileText, Loader2, Pencil, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PDFViewer } from '@/features/view-pdf'
import { SignatureModal } from '@/shared/components/common/signature'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { apiConfig } from '@/shared/api/constants'
import { cn } from '@/shared/lib/utils'
import { ActParticipant, areAllParticipantsSigned } from '@/features/inspections/model/act-participants'
import { ActParticipantsPanel } from './act-participants-panel'

interface InspectionActModalProps {
  isOpen: boolean
  onClose: () => void
  error: string | null
  isLoading: boolean
  isPdfLoading: boolean
  documentUrl: string
  participants: ActParticipant[]
  onSignatureChange: (index: number, signBase64: string) => void
  isFinalPdfReady: boolean
  submitApplicationMetaData: (sign: string) => void
  title?: string
  description?: string
  secondaryLabel?: string
}

export const InspectionActModal = ({
  isOpen,
  onClose,
  error,
  isLoading,
  isPdfLoading,
  documentUrl,
  participants,
  onSignatureChange,
  isFinalPdfReady,
  submitApplicationMetaData,
  title = 'Dalolatnomani imzolash',
  description = 'Qatnashuvchilar hujjat bilan tanishib imzo qo‘ygach, inspektor elektron raqamli imzo qo‘yadi.',
  secondaryLabel = 'Hujjatni o‘zgartirish',
}: InspectionActModalProps) => {
  const [isMobile, setIsMobile] = useState(false)
  const [mobileTab, setMobileTab] = useState<'document' | 'signatures'>('document')

  useEffect(() => {
    const isTouchMac = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1
    setIsMobile(
      isTouchMac || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    )
  }, [])

  useEffect(() => {
    if (isOpen) setMobileTab('document')
  }, [isOpen])

  const hasParticipants = participants.length > 0
  const signedCount = participants.filter((participant) => participant.signBase64).length
  const allSigned = areAllParticipantsSigned(participants)
  const canSign = allSigned && isFinalPdfReady && !isPdfLoading && Boolean(documentUrl)

  const renderDocument = () => {
    if (isPdfLoading) {
      return (
        <div className="flex h-full flex-col items-center justify-center py-8">
          <Loader2 className="text-primary mb-4 size-8 animate-spin" />
          <p className="text-center text-gray-600">Dalolatnoma shakllantirilmoqda...</p>
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
      <DialogContent className="flex flex-col gap-0 overflow-hidden rounded-xl! p-0 sm:h-[92dvh]! xl:w-[1180px]!">
        <DialogHeader className="flex-shrink-0 border-b p-4 md:px-6 md:py-4">
          <DialogTitle className="pr-8 text-base md:text-lg">{title}</DialogTitle>
          <p className="text-muted-foreground hidden text-left text-sm sm:block">{description}</p>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden xl:flex-row">
          {hasParticipants && (
            <div className="flex flex-shrink-0 gap-1 border-b bg-slate-100 p-1 xl:hidden">
              {(
                [
                  { id: 'document', label: 'Dalolatnoma' },
                  { id: 'signatures', label: `Imzolar ${signedCount}/${participants.length}` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMobileTab(tab.id)}
                  className={cn(
                    'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    mobileTab === tab.id ? 'bg-white text-[#4E75FF] shadow-xs' : 'text-slate-600'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div
            className={cn(
              'relative min-h-0 flex-1 overflow-hidden bg-gray-50',
              hasParticipants && mobileTab !== 'document' && 'hidden xl:block'
            )}
          >
            {renderDocument()}
          </div>

          {hasParticipants && (
            <aside
              className={cn(
                'flex min-h-0 flex-1 flex-shrink-0 xl:w-[360px] xl:flex-none xl:border-l',
                mobileTab !== 'signatures' && 'hidden xl:flex'
              )}
            >
              <ActParticipantsPanel participants={participants} onChange={onSignatureChange} disabled={isLoading} />
            </aside>
          )}
        </div>

        <div className="flex-shrink-0 border-t bg-white p-3 sm:p-4 md:px-6 md:py-4">
          {!allSigned && (
            <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Elektron imzo qo‘yishdan oldin barcha qatnashuvchilar imzosi olinishi shart.
            </p>
          )}
          {allSigned && !isFinalPdfReady && !isPdfLoading && (
            <p className="mb-3 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800">
              Imzolar hujjatga qo‘shilmoqda...
            </p>
          )}
          {hasParticipants && allSigned && isFinalPdfReady && !isPdfLoading && (
            <p className="mb-3 flex items-center gap-2 rounded-md bg-[#2ECD56]/10 px-3 py-2 text-sm text-[#1F7A36]">
              <ShieldCheck className="size-4" />
              Barcha qatnashuvchilar imzosi dalolatnomaga qo‘shildi.
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row">
              {isMobile && documentUrl && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => window.open(`${apiConfig.baseURL}${documentUrl}`, '_blank')}
                >
                  <FileText className="size-4" />
                  Hujjatni ko‘rish
                </Button>
              )}
              <Button variant="outline" className="w-full sm:w-auto" onClick={onClose} disabled={isLoading}>
                <Pencil className="size-4" />
                {secondaryLabel}
              </Button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row [&>button]:w-full sm:[&>button]:w-auto">
              {canSign ? (
                <SignatureModal
                  error={error}
                  isLoading={isLoading}
                  documentUrl={documentUrl}
                  submitApplicationMetaData={submitApplicationMetaData}
                />
              ) : (
                <Button disabled>Imzolash</Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
