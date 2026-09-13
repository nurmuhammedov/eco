import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { ApplicationModal } from '@/features/application/create-application'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { SignAction } from '../../model/types'
import { CADASTRE_PASSPORT_KEY, useRefreshPassport } from '../../model/use-cadastre-passport'
import { ConclusionDialog } from './conclusion-dialog'

export const CommitteeActions = ({ passportId }: { passportId: string }) => {
  const [action, setAction] = useState<SignAction | null>(null)
  const refresh = useRefreshPassport()

  const eimzo = useEimzo({
    pdfEndpoint: `/cadastre-passports/${passportId}/preview-pdf`,
    pdfMethod: 'get',
    submitEndpoint: `/cadastre-passports/${passportId}/committee-sign`,
    successMessage: 'Qo‘mita tomonidan muvaffaqiyatli imzolandi',
    queryKey: CADASTRE_PASSPORT_KEY,
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
      <Button onClick={() => setAction('APPROVED')}>Yakunlash</Button>

      <ConclusionDialog
        open={!!action}
        onOpenChange={(open) => !open && setAction(null)}
        title={isReject ? 'Rad etish' : 'Yakunlash'}
        submitLabel={isReject ? 'Rad etish' : 'Yakunlash'}
        destructive={isReject}
        onSubmit={(values) => {
          eimzo.handleCreateApplication({ ...values, signAction: action })
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
