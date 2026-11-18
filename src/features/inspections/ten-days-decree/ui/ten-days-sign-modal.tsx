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
import useAdd from '@/shared/hooks/api/use-add'
import { useQueryClient } from '@tanstack/react-query'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { useCloseRequest } from '@/features/inspections/hooks/use-close-request'

interface TenDaysSignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: {
    inspectionId: string
    filePath: string
  } | null
}

export const TenDaysSignModal = ({ open, onOpenChange, data }: TenDaysSignModalProps) => {
  const queryClient = useQueryClient()
  const { mutate: signDecree, isPending } = useAdd(
    '/inspections/decree/ten-days/sign',
    'Hujjat muvaffaqiyatli imzolandi'
  )
  // The region may have asked to close the inspection meanwhile: the backend refuses the signature then
  const { isActive: isCloseRequested } = useCloseRequest(data?.inspectionId, open && !!data?.inspectionId)

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
          invalidateEndpoint(queryClient, '/inspections/decree/ten-days')
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="! flex h-[1000px] !w-[740px] !max-w-[90vw] flex-col gap-0 p-0">
        <DialogHeader className="flex-shrink-0 border-b p-6 pb-4">
          <DialogTitle className="flex items-end gap-x-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            Hujjatni imzolash
          </DialogTitle>
          <DialogDescription>Imzolashdan oldin hujjat bilan to‘liq tanishib chiqing.</DialogDescription>
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden bg-gray-50">
          {data?.filePath ? (
            <iframe src={data.filePath} className="h-full w-full" title="Decree PDF" />
          ) : (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center">Fayl topilmadi</div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 border-t bg-white p-6 pt-4">
          {isCloseRequested && (
            <p className="mr-auto self-center text-sm text-amber-700">
              Tekshiruvni o‘tkazmasdan yakunlash so‘rovi ko‘rib chiqilmoqda: buyruqni imzolab bo‘lmaydi
            </p>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Bekor qilish
          </Button>
          {data?.filePath && !isCloseRequested && (
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
