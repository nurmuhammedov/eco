import { useDocumentSigning } from '@/shared/components/common/signature/model'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'
import { getSignatureKeys } from '@/shared/lib'
import { useSignatureClient } from '@/shared/hooks'
import { SignatureKey } from '@/shared/types/signature'
import { Loader2, Signature, UsbIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SignatureSelect } from '../index'
import { apiConfig } from '@/shared/api/constants'
import { useMobileDocumentSigning } from '../model'

interface SignatureModalProps {
  isLoading: boolean
  documentUrl: string
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
  submitApplicationMetaData,
}: SignatureModalProps) => {
  const { Client } = useSignatureClient()
  const { signatureKeys, isCKCPLuggedIn } = getSignatureKeys()
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
    <AlertDialog open={open} onOpenChange={setOpen}>
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
          <AlertDialogTrigger asChild>
            <Button loading={isLoading} disabled={isLoadingSignature || !!error}>
              <Signature className="size-4" />
              Imzolash
            </Button>
          </AlertDialogTrigger>
        </>
      )}
      <AlertDialogContent className="w-auto! max-w-[95vw]!">
        <AlertDialogHeader>
          <AlertDialogTitle>Elektron kalitni tanlang</AlertDialogTitle>
          <AlertDialogDescription>
            Imzolash uchun ERI kalitingizni tanlang! <br /> Bu amal orqali hujjat elektron tarzda imzolanadi va yuridik
            kuchga ega bo'ladi!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          {!isMobile && <SignatureSelect onSelect={handleSelectCertificate} certificates={signatureKeys} />}
          {/*{selectedCertificate && (*/}
          {/*  <div className="mt-4 rounded-md border border-green-100 bg-green-50 p-3">*/}
          {/*    <p className="text-sm text-green-800">*/}
          {/*      <span className="font-medium">Tanlangan kalit:</span> {selectedCertificate.CN}*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleConfirm()}
            disabled={!selectedCertificate || !!error}
            className={!selectedCertificate ? 'cursor-not-allowed opacity-50' : ''}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Tasdiqlash
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
