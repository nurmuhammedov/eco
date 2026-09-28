import type { DocumentSigner, SignatureStatus } from '../../model/document-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'

import { FC } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import { format } from 'date-fns'

/** Each signer either signed or turned the document down */
const SIGNER_STATUSES: Record<SignatureStatus, { label: string; variant: 'info' | 'error' }> = {
  APPROVED: { label: 'Imzolangan', variant: 'info' },
  REJECTED: { label: 'Rad etilgan', variant: 'error' },
}

interface Props {
  signers: DocumentSigner[]
  setSigners: (signers: DocumentSigner[]) => void
}

const SignersModal: FC<Props> = ({ signers, setSigners }) => {
  const handleModal = (isOpen: boolean) => {
    if (!isOpen) {
      setSigners([])
    }
  }
  return (
    <Dialog onOpenChange={handleModal} open={!!signers.length}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle className="text-blue-400">Imzolagan shaxslar</DialogTitle>
        </DialogHeader>
        <div>
          {signers.map((signer) => {
            const currentLabel = signer.status ? SIGNER_STATUSES[signer.status] : undefined

            return (
              <div
                key={signer.signerUserId ?? signer.signedBy}
                className="flex items-center justify-between gap-4 rounded p-2.5 text-sm odd:bg-neutral-50"
              >
                <p>{signer.signedBy}</p>
                <p className="flex-shrink-0 text-xs text-slate-400">
                  {signer.createdAt && format(signer.createdAt, 'dd.MM.yyyy, HH:mm:ss')}
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
