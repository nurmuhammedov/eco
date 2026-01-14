import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { FileText } from 'lucide-react'
import { SignatureModal } from '@/shared/components/common/signature/ui/signature-modal'
import useAdd from '@/shared/hooks/api/useAdd'

interface TenDaysSignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: {
    inspectionId: string
    filePath: string
  } | null
}

export const TenDaysSignModal = ({ open, onOpenChange, data }: TenDaysSignModalProps) => {
  const { mutate: signDecree, isPending } = useAdd(
    '/inspections/decree/ten-days/sign',
    'Hujjat muvaffaqiyatli imzolandi'
  )

  const handleSubmit = (sign: string) => {
    if (!data) return
    signDecree(
      {
        inspectionId: data.inspectionId,
        filePath: data.filePath,
        sign: sign,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[1000px] max-h-[95vh] w-[740px] max-w-[98vw] flex-col gap-0 p-0">
        <DialogHeader className="flex-shrink-0 border-b p-6 pb-4">
          <DialogTitle className="flex items-end gap-x-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            Hujjatni imzolash
          </DialogTitle>
          <DialogDescription>Imzolashdan oldin hujjat bilan to'liq tanishib chiqing.</DialogDescription>
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden bg-gray-50">
          {data?.filePath ? (
            <iframe src={data.filePath} className="h-full w-full" title="Decree PDF" />
          ) : (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center">Fayl topilmadi</div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 border-t bg-white p-6 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Bekor qilish
          </Button>
          {data?.filePath && (
            <SignatureModal
              isLoading={isPending}
              documentUrl={data.filePath}
              error={null}
              submitApplicationMetaData={handleSubmit}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
