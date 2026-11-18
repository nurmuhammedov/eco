import { useRef, type ChangeEvent } from 'react'
import { format, parseISO } from 'date-fns'
import { FileCheck2, ShieldCheck, Upload } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { SignatureModal } from '@/shared/components/common/signature'
import type { AttestationCalendar } from '@/entities/attestation/model/types'
import { useSignProtocol, useUploadProtocol } from '../model/use-applicants'

const ACCEPTED_SCANS = '.pdf,.jpg,.jpeg,.png'

const dateTime = (value?: string | null) => (value ? format(parseISO(value), 'dd.MM.yyyy HH:mm') : '')

/**
 * Confirming the protocol (resolution No. 26, item 38). Only the commission
 * chairman signs it: with E-IMZO, which is final, or on paper, and the scan
 * is uploaded here. A scan may be replaced until the protocol is e-signed.
 */
export const ProtocolConfirmation = ({ calendar }: { calendar: AttestationCalendar }) => {
  const signProtocol = useSignProtocol()
  const uploadProtocol = useUploadProtocol()
  const fileInput = useRef<HTMLInputElement>(null)

  if (!calendar.protocol_status) return null

  if (calendar.protocol_status === 'SIGNED') {
    return (
      <Badge variant="success" className="h-9 gap-1.5 px-3" title="Komissiya raisining elektron raqamli imzosi">
        <ShieldCheck className="h-4 w-4" />
        Rais imzolagan: {calendar.protocol_signer_name} · {dateTime(calendar.protocol_signed_at)}
      </Badge>
    )
  }

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // The same file may be picked again after a failed upload
    event.target.value = ''

    if (file) uploadProtocol.mutate({ calendarId: calendar.id, file })
  }

  const isUploaded = calendar.protocol_status === 'UPLOADED'

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isUploaded ? (
        <Badge
          variant="success"
          className="h-9 gap-1.5 px-3"
          title={[calendar.protocol_uploaded_by_name, dateTime(calendar.protocol_uploaded_at)]
            .filter(Boolean)
            .join(' · ')}
        >
          <FileCheck2 className="h-4 w-4" />
          Imzolangan nusxa yuklangan
        </Badge>
      ) : (
        <Badge variant="warning" className="h-9 px-3" title="Bayonnomani faqat komissiya raisi imzolaydi">
          Rais imzolamagan
        </Badge>
      )}

      {/* The chairman's key signs the protocol's hash; the server checks whose key it is */}
      {!isUploaded && calendar.protocol_hash && (
        <SignatureModal
          isLoading={signProtocol.isPending}
          documentUrl=""
          hashCode={calendar.protocol_hash}
          error={null}
          submitApplicationMetaData={(sign) => signProtocol.mutate({ calendarId: calendar.id, sign })}
        />
      )}

      <input ref={fileInput} type="file" accept={ACCEPTED_SCANS} className="hidden" onChange={pickFile} />
      <Button
        type="button"
        variant="outline"
        loading={uploadProtocol.isPending}
        onClick={() => fileInput.current?.click()}
        title="Rais qog‘ozda imzolagan bayonnomaning skaneri (PDF, JPG yoki PNG)"
      >
        {!uploadProtocol.isPending && <Upload className="h-4 w-4" />}
        {isUploaded ? 'Boshqa nusxa yuklash' : 'Imzolangan nusxani yuklash'}
      </Button>
    </div>
  )
}
