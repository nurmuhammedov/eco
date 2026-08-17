import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx'

import { FC } from 'react'
import { TriangleAlert } from 'lucide-react'

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
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600">
              <TriangleAlert size={18} />
            </span>
            <div className="flex flex-col gap-1 text-left">
              <DialogTitle className="text-base">Ijro noto‘g‘ri bajarilgan</DialogTitle>
              <p className="text-sm text-neutral-500">Arizani ko‘rib chiqqan rahbar quyidagi izohni qoldirgan.</p>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-md border border-rose-100 bg-rose-50/60 px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-neutral-800">
          {message}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RejectMessageModal
