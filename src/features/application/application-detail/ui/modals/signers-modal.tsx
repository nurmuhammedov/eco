import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx'

import { FC } from 'react'
import { Badge } from '@/shared/components/ui/badge.tsx'
import { format } from 'date-fns'
import { signStatuses } from '@/features/application/application-detail/ui/parts/appeal-response-docs.tsx'

interface Props {
  signers: any
  setSigners: (signers: any[]) => void
}

const SignersModal: FC<Props> = ({ signers, setSigners }) => {
  const handleModal = (isOpen: boolean) => {
    if (!isOpen) {
      setSigners([])
    }
  }
  return (
    <Dialog onOpenChange={handleModal} open={!!signers.length}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Imzolagan shaxslar</DialogTitle>
        </DialogHeader>
        <div>
          {signers.map((signer: any) => {
            const currentLabel = signStatuses.get(signer.isSigned)

            return (
              <div className="flex items-center justify-between gap-4 rounded p-2.5 text-sm odd:bg-neutral-50">
                <p>{signer?.signedBy}</p>
                <p className="flex-shrink-0 text-xs text-slate-400">
                  {format(signer?.createdAt, 'dd.MM.yyyy, HH:mm:ss')}
                </p>
                <p className="shrink-0">
                  {currentLabel && <Badge variant={currentLabel.variant}>{currentLabel.label}</Badge>}
                </p>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignersModal
