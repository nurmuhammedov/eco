import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { ApplicationModal } from '@/features/application/create-application'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { SignAction } from '../../model/types'
import { useRefreshPassport } from '../../model/use-cadastre-passport'
import { TextDialog } from './text-dialog'

export const CustomerActions = ({ passportId }: { passportId: string }) => {
  const [action, setAction] = useState<SignAction | null>(null)
  const refresh = useRefreshPassport()

  const eimzo = useEimzo({
    pdfEndpoint: `/cadastre-passports/${passportId}/preview-pdf`,
    pdfMethod: 'get',
    submitEndpoint: `/cadastre-passports/${passportId}/customer-sign`,
    successMessage: 'Muvaffaqiyatli bajarildi',
    invalidates: '/cadastre-passports',
    transformSubmitPayload: (dto, sign, filePath) => {
      const { signAction, ...rest } = dto || {}

      return { dto: rest, signAction, sign, filePath }
    },
    onEnd: refresh,
  })

  const isReject = action === 'REJECTED'

  return (
    <>
      <Button variant="destructive" onClick={() => setAction('REJECTED')}>
        Rad etish
      </Button>
      <Button onClick={() => setAction('APPROVED')}>Tasdiqlash</Button>

      <TextDialog
        open={!!action}
        onOpenChange={(open) => !open && setAction(null)}
        title={isReject ? 'Rad etish' : 'Tasdiqlash'}
        label={isReject ? 'Rad etish sababi' : 'Xulosa'}
        required={isReject}
        destructive={isReject}
        submitLabel={isReject ? 'Rad etish' : 'Tasdiqlash'}
        onSubmit={(conclusion) => {
          eimzo.handleCreateApplication({ conclusion: conclusion || undefined, signAction: action })
          setAction(null)
        }}
      />

      <ApplicationModal
        error={eimzo.error}
        isOpen={eimzo.isModalOpen}
        isLoading={eimzo.isLoading}
        documentUrl={eimzo.documentUrl!}
        onClose={eimzo.handleCloseModal}
        isPdfLoading={eimzo.isPdfLoading}
        submitApplicationMetaData={eimzo.submitApplicationMetaData}
      />
    </>
  )
}
