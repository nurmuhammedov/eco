import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import FileLink from '@/shared/components/common/file-link'
import { ApplicationModal } from '@/features/application/create-application'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { DEFAULT_POSITIVE_CONCLUSION, WORKFLOW_ACTION_LABELS } from '../../model/labels'
import { CadastrePassport, WorkflowAction, WorkflowInstance } from '../../model/types'
import { useRefreshPassport, useWorkflowHistory } from '../../model/use-cadastre-passport'
import { ConclusionDialog } from './conclusion-dialog'
import { SectionFormDialog } from './section-form-dialog'
import { TextDialog } from './text-dialog'

type Command = 'submit' | 'endorse' | 'return' | 'reject'

interface WorkflowActionsProps {
  passport: CadastrePassport
  workflow: WorkflowInstance
}

export const WorkflowActions = ({ passport, workflow }: WorkflowActionsProps) => {
  const [dialog, setDialog] = useState<WorkflowAction | null>(null)
  const refresh = useRefreshPassport()

  const actions = new Set(workflow.allowedActions)
  const section = workflow.slot === 'FVV' ? passport.cadastreData?.fvvData : passport.cadastreData?.sesData

  const close = () => setDialog(null)
  const onOpenChange = (open: boolean) => !open && close()

  const { mutate: run, isPending } = useMutation({
    mutationFn: ({ command, body }: { command: Command; body?: object }) =>
      apiClient.post<any>(`/cadastre-passports/${passport.id}/workflow/${command}`, body ?? {}),
    onSuccess: (response: any) => {
      toast.success(response?.data?.message || 'Muvaffaqiyatli bajarildi')
      close()
      refresh()
    },
  })

  const { data: history } = useWorkflowHistory(workflow.id, actions.has('SIGN'))
  const submission = [...(history ?? [])].reverse().find((entry) => entry.action === 'SUBMIT')

  const eimzo = useEimzo({
    pdfEndpoint: `/cadastre-passports/${passport.id}/preview-pdf`,
    pdfMethod: 'get',
    submitEndpoint: `/cadastre-passports/${passport.id}/workflow/sign`,
    successMessage: 'E-imzo bilan tasdiqlandi',
    invalidates: '/cadastre-passports',
    transformSubmitPayload: (_dto, sign) => ({ sign }),
    onEnd: refresh,
  })

  return (
    <>
      {actions.has('FILL_DATA') && (
        <Button variant="primaryOutline" onClick={() => setDialog('FILL_DATA')}>
          {WORKFLOW_ACTION_LABELS.FILL_DATA}
        </Button>
      )}
      {actions.has('RETURN') && (
        <Button variant="outline" onClick={() => setDialog('RETURN')}>
          {WORKFLOW_ACTION_LABELS.RETURN}
        </Button>
      )}
      {actions.has('REJECT') && (
        <Button variant="destructive" onClick={() => setDialog('REJECT')}>
          {WORKFLOW_ACTION_LABELS.REJECT}
        </Button>
      )}
      {actions.has('ENDORSE') && <Button onClick={() => setDialog('ENDORSE')}>{WORKFLOW_ACTION_LABELS.ENDORSE}</Button>}
      {/* The server is the one that knows whether the section is complete; a
          disabled button only hid the action from an executor who had filled it
          in elsewhere. */}
      {actions.has('SUBMIT') && <Button onClick={() => setDialog('SUBMIT')}>{WORKFLOW_ACTION_LABELS.SUBMIT}</Button>}
      {actions.has('SIGN') && <Button onClick={() => setDialog('SIGN')}>{WORKFLOW_ACTION_LABELS.SIGN}</Button>}

      <SectionFormDialog
        open={dialog === 'FILL_DATA'}
        onOpenChange={onOpenChange}
        passportId={passport.id}
        slot={workflow.slot}
        data={section}
        onSaved={refresh}
      />

      <ConclusionDialog
        open={dialog === 'SUBMIT'}
        onOpenChange={onOpenChange}
        title={WORKFLOW_ACTION_LABELS.SUBMIT}
        submitLabel="Yuborish"
        defaultText={DEFAULT_POSITIVE_CONCLUSION}
        isPending={isPending}
        onSubmit={(values) => run({ command: 'submit', body: values })}
      />

      <TextDialog
        open={dialog === 'RETURN'}
        onOpenChange={onOpenChange}
        title={WORKFLOW_ACTION_LABELS.RETURN}
        description={workflow.returnToStep ? `Ish ${workflow.returnToStep}-pog‘onaga qaytadi` : null}
        label="Qaytarish sababi"
        submitLabel={WORKFLOW_ACTION_LABELS.RETURN}
        isPending={isPending}
        onSubmit={(reason) => run({ command: 'return', body: { reason } })}
      />

      <TextDialog
        open={dialog === 'REJECT'}
        onOpenChange={onOpenChange}
        title="Kadastr pasportini rad etish"
        description="Pasport butunlay rad etiladi, boshqa tashkilot jarayoni ham bekor qilinadi"
        label="Rad etish sababi"
        submitLabel={WORKFLOW_ACTION_LABELS.REJECT}
        destructive
        isPending={isPending}
        onSubmit={(reason) => run({ command: 'reject', body: { reason } })}
      />

      <Dialog open={dialog === 'ENDORSE'} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{WORKFLOW_ACTION_LABELS.ENDORSE}</DialogTitle>
            <DialogDescription>Ish keyingi pog‘onaga o‘tadi. Davom etasizmi?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Bekor qilish
            </Button>
            <Button loading={isPending} onClick={() => run({ command: 'endorse' })}>
              {WORKFLOW_ACTION_LABELS.ENDORSE}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === 'SIGN'} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{WORKFLOW_ACTION_LABELS.SIGN}</DialogTitle>
            <DialogDescription>Titul varag‘i tashkilot rahbarining e-imzosi bilan tasdiqlanadi.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-900">Ijrochi xulosasi</p>
            {submission ? (
              <>
                {submission.comment && (
                  <p className="rounded-md bg-neutral-50 px-3 py-2 text-sm whitespace-pre-line text-neutral-800">
                    {submission.comment}
                  </p>
                )}
                {submission.filePath && <FileLink url={submission.filePath} title="Xulosa fayli" />}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Xulosa topilmadi</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Bekor qilish
            </Button>
            <Button
              onClick={() => {
                close()
                eimzo.handleCreateApplication({})
              }}
            >
              {WORKFLOW_ACTION_LABELS.SIGN}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
