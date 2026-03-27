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

interface RejectAppealModalProps {
  documentId: string
}

const RejectAppealModal: React.FC<RejectAppealModalProps> = ({ documentId }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { id: appealId } = useParams<{ id: string }>()
  const { mutate: confirmDocument, isPending } = useConfirmDocument()
  const { data: applicationData } = useApplicationDetail()

  const isDeregister = applicationData?.appealType?.startsWith('DEREGISTER')

  const handleReject = () => {
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
        <Button variant="destructive">Arizani rad etish</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isDeregister ? 'Reyestrdan chiqarilmasinmi?' : 'Reyestrga qo\u2019shilmasinmi?'}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Arizani rad etishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Bekor qilish
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" disabled={isPending} onClick={handleReject}>
            Ha, rad etish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RejectAppealModal
