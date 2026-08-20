import { useEffect, useState } from 'react'
import { Eraser, PenLine, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useSignatureCanvas } from '../model/use-signature-canvas'

interface HandSignatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  signerName: string
  signerPosition?: string
  onSave: (signBase64: string) => void
}

export const HandSignatureDialog = ({
  open,
  onOpenChange,
  signerName,
  signerPosition,
  onSave,
}: HandSignatureDialogProps) => {
  const { canvasRef, isEmpty, clear, undo, toPngBase64, canvasHandlers } = useSignatureCanvas()
  const [showRotateHint, setShowRotateHint] = useState(false)

  useEffect(() => {
    if (open) clear()
  }, [open, clear])

  useEffect(() => {
    if (!open) return
    const check = () => setShowRotateHint(window.innerWidth < 640 && window.innerHeight > window.innerWidth)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [open])

  const handleSave = () => {
    const signBase64 = toPngBase64()
    if (!signBase64) return
    onSave(signBase64)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95dvh]! w-[calc(100vw-1rem)]! max-w-[calc(100vw-1rem)]! flex-col gap-0 overflow-hidden rounded-xl! p-0 sm:w-[95vw]! sm:max-w-[95vw]! lg:w-[900px]!">
        <DialogHeader className="flex-shrink-0 border-b p-4 md:p-6 md:pb-4">
          <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
            <PenLine className="size-5 text-[#4E75FF]" />
            Imzo qo‘yish
          </DialogTitle>
          <p className="text-muted-foreground pt-1 text-left text-sm">
            <span className="text-foreground font-medium">{signerName}</span>
            {signerPosition ? ` — ${signerPosition}` : ''}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {showRotateHint && (
            <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Qulayroq imzolash uchun qurilmani yon holatga buring.
            </p>
          )}

          <div className="relative rounded-xl border-2 border-dashed border-neutral-300 bg-white">
            <canvas
              ref={canvasRef}
              {...canvasHandlers}
              className="h-[38dvh] max-h-[320px] min-h-[180px] w-full touch-none rounded-xl sm:h-[260px] md:h-[320px]"
            />

            {isEmpty && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
                <PenLine className="size-6 text-neutral-300" />
                <p className="text-sm text-neutral-400">Shu maydonga imzoingizni chizing</p>
              </div>
            )}

            <div className="pointer-events-none absolute right-8 bottom-10 left-8 border-b border-neutral-200" />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted-foreground text-xs">
              Imzo qo‘yish orqali dalolatnoma mazmuni bilan tanishganingizni tasdiqlaysiz.
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={undo} disabled={isEmpty}>
                <RotateCcw className="size-4" />
                Orqaga
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={clear} disabled={isEmpty}>
                <Eraser className="size-4" />
                Tozalash
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-end md:p-6 md:pt-4">
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button type="button" className="w-full sm:w-auto" onClick={handleSave} disabled={isEmpty}>
            Imzoni saqlash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
