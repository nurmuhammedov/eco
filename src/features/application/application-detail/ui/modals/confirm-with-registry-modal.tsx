import { useConfirmDocument } from '@/features/application/application-detail/hooks/mutations/se-confirm-document'
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail'
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

interface ConfirmWithRegistryModalProps {
  documentId: string
}

const ConfirmWithRegistryModal: React.FC<ConfirmWithRegistryModalProps> = ({ documentId }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { id: appealId } = useParams<{ id: string }>()
  const { mutate: confirmDocument, isPending } = useConfirmDocument()
  const { data: applicationData } = useApplicationDetail()

  const isDeregister = applicationData?.appealType?.startsWith('DEREGISTER')

  const onConfirm = () => {
    confirmDocument(
      {
        appealId,
        documentId,
        shouldRegister: true,
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
        <Button variant="success">Arizani tasdiqlash</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isDeregister ? 'Arizani haqiqatdan ham tasdiqlaysizmi?' : 'Arizani haqiqatdan ham tasdiqlaysizmi?'}
          </DialogTitle>
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
          <Button type="button" onClick={onConfirm} disabled={isPending}>
            Tasdiqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmWithRegistryModal
