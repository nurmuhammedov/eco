import { useConfirmDocument } from '@/features/application/application-detail/hooks/mutations/se-confirm-document'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import React from 'react'
import { useParams } from 'react-router-dom'

interface RejectAppealModalProps {
  documentId: string
  label?: string
}

export const RejectAppealModal: React.FC<RejectAppealModalProps> = ({ documentId, label = 'Arizani rad etish' }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { id: appealId } = useParams<{ id: string }>()
  const { mutate: confirmDocument, isPending } = useConfirmDocument()

  const onConfirm = () => {
    confirmDocument(
      {
        appealId,
        documentId,
        shouldRegister: false,
      },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{label}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Arizani rad etishni tasdiqlaysizmi?</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-slate-500">Bu amalni ortga qaytarib bo‘lmaydi!</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Bekor qilish
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isPending}>
            Arizani rad etish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
