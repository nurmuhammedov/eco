import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { format, isBefore, parseISO, startOfToday } from 'date-fns'
import { AlertTriangle, Award, Loader2, Video } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Textarea } from '@/shared/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import {
  APPLICATION_STATUS,
  DEFAULT_REJECT_REASON,
  DIRECTION,
  EMPLOYEE_TYPE,
  REQUEST_STATUS,
} from '@/entities/attestation/model/labels'
import type { AttestationCalendar, AttestationRequest } from '@/entities/attestation/model/types'
import { formatExamTime } from '@/entities/attestation/lib/exam-time'
import { attestationDocumentRoutes, type DocumentAudience } from '@/entities/attestation/lib/open-document'
import { DocumentButton } from '@/entities/attestation/ui/document-button'
import { useCommission } from '@/features/attestation/commission/model/use-commission'
import { useAcceptRequest, useRejectRequest, useRequest } from '../model/use-requests'

interface Props {
  request: AttestationRequest | null
  audience: DocumentAudience
  onClose: () => void
}

type Step = 'view' | 'accept' | 'reject'

const date = (value?: string | null) => (value ? format(parseISO(value), 'dd.MM.yyyy') : '-')

const InfoItem = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <div className="text-sm font-medium">{value || '-'}</div>
  </div>
)

/**
 * One request with its employees, decision and documents. The commission also
 * decides on it here: admitting queues the employees, rejecting needs the
 * exact reason (resolution No. 26, item 26).
 */
export function RequestDialog({ request, audience, onClose }: Props) {
  const isCommission = audience === 'commission'
  const [step, setStep] = useState<Step>('view')
  const [reason, setReason] = useState(DEFAULT_REJECT_REASON)

  // The commission's list carries no employees; the organization's does
  const { data: detail, isLoading } = useRequest(isCommission && request ? request.id : '')
  const current = detail ?? request
  const isPending = current?.status === 'PENDING'

  const { data: commission } = useCommission(isCommission && isPending)
  const problems = commission?.problems ?? []

  const accept = useAcceptRequest()
  const reject = useRejectRequest()
  const isSaving = accept.isPending || reject.isPending

  useEffect(() => {
    setStep('view')
    setReason(DEFAULT_REJECT_REASON)
  }, [request?.id])

  const routes = attestationDocumentRoutes(audience)
  const tinParams = isCommission && current ? { organization_tin: current.organization_tin } : undefined
  const applications = useMemo(() => current?.applications ?? [], [current])

  // Exams the employees were put into, each with its own notice and protocol
  const calendars = useMemo(() => {
    const seen = new Map<string, AttestationCalendar>()
    applications.forEach((application) => {
      if (application.calendar) seen.set(application.calendar.id, application.calendar)
    })

    return [...seen.values()]
  }, [applications])

  if (!request) return null

  const status = current ? REQUEST_STATUS[current.status] : null
  const isOverdue =
    isPending && !!current?.decision_due_at && isBefore(parseISO(current.decision_due_at), startOfToday())

  const decide = () => {
    if (!current) return

    if (step === 'accept') accept.mutate(current.id, { onSuccess: () => setStep('view') })
    if (step === 'reject')
      reject.mutate({ id: current.id, reason: reason.trim() }, { onSuccess: () => setStep('view') })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Attestatsiya arizasi</DialogTitle>
        </DialogHeader>

        {!current || (isCommission && isLoading && !detail) ? (
          <div className="flex justify-center py-10">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{current.organization_name}</h3>
              <span className="text-muted-foreground text-xs">STIR: {current.organization_tin}</span>
              {status && <Badge variant={status.variant}>{status.label}</Badge>}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoItem label="Tashkilot rahbari" value={current.organization_director} />
              <InfoItem label="Yo‘nalish" value={DIRECTION[current.direction]} />
              <InfoItem
                label="Xodim turi"
                value={
                  <Badge variant="outline" className={EMPLOYEE_TYPE[current.employee_type].className}>
                    {EMPLOYEE_TYPE[current.employee_type].label}
                  </Badge>
                }
              />
              <InfoItem label="Yuborilgan sana" value={date(current.created_at)} />
              {isPending ? (
                <InfoItem
                  label="Ko‘rib chiqish muddati"
                  value={
                    <span className={isOverdue ? 'text-red-600' : undefined}>
                      {date(current.decision_due_at)}
                      {isOverdue && ' (muddati o‘tgan)'}
                    </span>
                  }
                />
              ) : (
                <InfoItem
                  label="Qaror"
                  value={current.decision_number ? `${current.decision_number}-son, ${date(current.decided_at)}` : '-'}
                />
              )}
              {!isPending && <InfoItem label="Ko‘rib chiqqan" value={current.decided_by_name} />}
            </div>

            {current.reject_reason && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <p className="mb-1 font-medium">Rad etish sababi</p>
                <p className="whitespace-pre-line">{current.reject_reason}</p>
              </div>
            )}

            {current.decision_number && (
              <div className="flex flex-wrap gap-2">
                <DocumentButton
                  url={routes.request(current.id, 'decision')}
                  fileName={`qaror-${current.decision_number}.pdf`}
                  label="Qaror"
                />
                <DocumentButton
                  url={routes.request(current.id, 'decision-letter')}
                  fileName={`xat-qaror-${current.decision_number}.pdf`}
                  label="Tashkilotga xat"
                />
              </div>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Xodim</TableHead>
                    <TableHead>Lavozimi</TableHead>
                    <TableHead>Holati</TableHead>
                    <TableHead>Imtihon</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => {
                    const cfg = APPLICATION_STATUS[application.status]
                    const exam = application.calendar
                    const canJoin =
                      !isCommission && !!exam?.zoom_join_url && ['ASSIGNED', 'SCHEDULED'].includes(application.status)

                    return (
                      <TableRow key={application.id}>
                        <TableCell>
                          <p className="font-medium">{application.employee_name}</p>
                          <p className="text-muted-foreground text-xs">{application.employee_pin}</p>
                        </TableCell>
                        <TableCell>{application.employee_position || '-'}</TableCell>
                        <TableCell>
                          {cfg ? <Badge variant={cfg.variant}>{cfg.label}</Badge> : application.status_label}
                        </TableCell>
                        <TableCell>
                          {exam ? (
                            <div>
                              <p>{formatExamTime(exam)}</p>
                              {exam.location && <p className="text-muted-foreground text-xs">{exam.location}</p>}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">Belgilanmagan</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {canJoin && exam?.zoom_join_url && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-500"
                                title="Zoomga kirish"
                                asChild
                              >
                                <a href={exam.zoom_join_url} target="_blank" rel="noreferrer">
                                  <Video className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {application.certificate_number && (
                              <DocumentButton
                                url={routes.certificate(application.id)}
                                fileName={`guvohnoma-${application.certificate_number}.pdf`}
                                label="Attestatsiya guvohnomasi"
                                icon={<Award className="h-4 w-4" />}
                                iconOnly
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {calendars.map((exam) => (
              <div key={exam.id} className="flex flex-wrap items-center gap-2 rounded-md border p-3">
                <span className="mr-auto text-sm font-medium">Imtihon: {formatExamTime(exam)}</span>
                <DocumentButton
                  url={routes.calendar(exam.id, 'notice')}
                  params={tinParams}
                  fileName={`xabarnoma-${current.organization_tin}.pdf`}
                  label="O‘tkazilishi haqida xat"
                />
                {exam.protocol_number && (
                  <>
                    <DocumentButton
                      url={routes.calendar(exam.id, 'protocol')}
                      params={tinParams}
                      fileName={`bayonnoma-${exam.protocol_number}.pdf`}
                      label="Bayonnoma"
                    />
                    <DocumentButton
                      url={routes.calendar(exam.id, 'protocol-letter')}
                      params={tinParams}
                      fileName={`bayonnoma-xati-${exam.protocol_number}.pdf`}
                      label="Bayonnoma xati"
                    />
                  </>
                )}
              </div>
            ))}

            {isCommission && isPending && problems.length > 0 && (
              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p>Qaror qabul qilish uchun komissiya tarkibi to‘liq bo‘lishi kerak: {problems.join('; ')}.</p>
                  <Link to="/attestation/commission" className="font-medium underline">
                    Komissiya tarkibini to‘ldirish
                  </Link>
                </div>
              </div>
            )}

            {step === 'reject' && (
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Rad etish sababi <span className="text-red-500">*</span>
                </p>
                <Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} />
                <p className="text-muted-foreground text-xs">
                  Sabab qarorga va tashkilotga yuboriladigan xatga so‘zma-so‘z yoziladi.
                </p>
              </div>
            )}

            {step === 'accept' && (
              <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                Qaror raqami beriladi, xodimlar imtihon navbatiga tushadi. Qarorni keyin o‘zgartirib bo‘lmaydi.
              </p>
            )}
          </div>
        )}

        {isCommission && isPending && (
          <DialogFooter>
            {step === 'view' ? (
              <>
                <Button
                  variant="destructiveOutline"
                  onClick={() => setStep('reject')}
                  disabled={problems.length > 0 || isSaving}
                >
                  Rad etish
                </Button>
                <Button variant="success" onClick={() => setStep('accept')} disabled={problems.length > 0 || isSaving}>
                  Attestatsiyaga qo‘yish
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep('view')} disabled={isSaving}>
                  Orqaga
                </Button>
                <Button
                  variant={step === 'reject' ? 'destructive' : 'success'}
                  onClick={decide}
                  disabled={isSaving || (step === 'reject' && reason.trim().length < 10)}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {step === 'reject' ? 'Rad etish qarorini chiqarish' : 'Qaror chiqarish'}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
