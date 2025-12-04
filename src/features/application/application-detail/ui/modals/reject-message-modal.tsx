import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx'

import { FC } from 'react'

interface Props {
  message: any
  setMessage: (message: string) => void
}

const RejectMessageModal: FC<Props> = ({ message, setMessage }) => {
  const handleModal = (isOpen: boolean) => {
    if (!isOpen) {
      setMessage('')
    }
  }
  return (
    <Dialog onOpenChange={handleModal} open={!!message}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Kelishilmaslik sababi</DialogTitle>
        </DialogHeader>
        <div>{message}</div>
      </DialogContent>
    </Dialog>
  )
}

export default RejectMessageModal
