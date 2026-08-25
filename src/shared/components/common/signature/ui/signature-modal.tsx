import { useDocumentSigning } from '@/shared/components/common/signature/model'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { useSignatureKeys } from '@/shared/lib'
import { useSignatureClient } from '@/shared/hooks'
import { SignatureKey } from '@/shared/types/signature'
import { Signature, UsbIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SignatureSelect } from '../index'
import { apiConfig } from '@/shared/api/constants'
import { useMobileDocumentSigning } from '../model'

interface SignatureModalProps {
  isLoading: boolean
  documentUrl: string
  hashCode?: string | null
  error: any
  onCancel?: () => void
  submitApplicationMetaData: (sign: string) => void
  onConfirm?: (certificate: SignatureKey | null) => void
}

export const SignatureModal = ({
  onCancel,
  onConfirm,
  error,
  isLoading,
  documentUrl,
  hashCode,
  submitApplicationMetaData,
}: SignatureModalProps) => {
  const { Client } = useSignatureClient()
  const { signatureKeys, isCKCPLuggedIn } = useSignatureKeys()
  const [open, setOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<SignatureKey | null>(null)

  // Desktop
  const { mutateAsync: signDocument, isPending } = useDocumentSigning()

  // Mobile
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  }, [])
  const {
    startSigning: startMobileSigning,
    isStarting: isMobileStarting,
    isPolling: isMobilePolling,
    deepLink,
  } = useMobileDocumentSigning({ documentUrl, onSuccess: submitApplicationMetaData })

  const isLoadingSignature = isLoading || isPending || isMobileStarting

  const handleSelectCertificate = (cert: SignatureKey) => {
    setSelectedCertificate(cert)
  }

  const handleConfirm = async (ckc: boolean = false) => {
    if (onConfirm) {
      onConfirm(selectedCertificate)
    }

    if (apiConfig.oneIdClientId == 'test_cirns_uz') {
      submitApplicationMetaData('testServer')
    } else {
      await signDocument({
        Client,
        documentUrl,
        hashCode,
        signature: ckc ? 'ckc' : selectedCertificate,
        onSuccess: (result) => submitApplicationMetaData(result),
      })
    }

    setSelectedCertificate(null)
    setOpen(false)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    setOpen(false)
    setSelectedCertificate(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {apiConfig.oneIdClientId == 'test_cirns_uz' ? (
        <Button loading={isLoading} onClick={() => handleConfirm()} disabled={isLoading || !!error}>
          <Signature className="size-4" />
          Imzolash
        </Button>
      ) : isMobile ? (
        <>
          <Button
            variant="default"
            className="w-full md:w-auto"
            loading={isLoadingSignature}
            disabled={isLoadingSignature || !!error}
            onClick={() => {
              if (deepLink) {
                window.location.href = deepLink
              } else {
                startMobileSigning()
              }
            }}
          >
            <Signature className="size-4" />
            {isMobilePolling
              ? 'Ilovada tasdiqlang...'
              : deepLink
                ? 'E-imzo ilovasini ochish'
                : 'Mobil ilova orqali imzolash'}
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="success"
            loading={isLoading}
            onClick={() => handleConfirm(true)}
            disabled={isLoading || !!error || !isCKCPLuggedIn}
          >
            <UsbIcon className="size-4" />
            USB token orqali imzolash
          </Button>
          <DialogTrigger asChild>
            <Button loading={isLoading} disabled={isLoadingSignature || !!error}>
              <Signature className="size-4" />
              Imzolash
            </Button>
          </DialogTrigger>
        </>
      )}
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Elektron kalitni tanlang</DialogTitle>
          <DialogDescription>
            Imzolash uchun ERI kalitingizni tanlang. Bu amal orqali hujjat elektron tarzda imzolanadi va yuridik kuchga
            ega bo‘ladi.
          </DialogDescription>
        </DialogHeader>

        <SignatureSelect
          certificates={signatureKeys}
          value={selectedCertificate}
          onSelect={handleSelectCertificate}
          disabled={isPending}
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Bekor qilish
          </Button>
          <Button onClick={() => handleConfirm()} disabled={!selectedCertificate || !!error} loading={isPending}>
            Tasdiqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
