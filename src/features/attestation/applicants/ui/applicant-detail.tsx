import { useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { CheckCircle2, ListChecks, Loader2, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { NoData } from '@/shared/components/common/no-data'
import GoBack from '@/shared/components/common/go-back'
import { APPLICATION_STATUS, DIRECTION, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import { useApplication, useExamQuestions, useGenerateExam, useSetResult } from '../model/use-applicants'

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-muted-foreground text-xs">{label}</p>
    <div className="text-sm font-medium">{value || '-'}</div>
  </div>
)

export const ApplicantDetail = () => {
  const { id = '' } = useParams()

  const { data: application, isLoading } = useApplication(id)
  const { data: sessions = [], isLoading: isLoadingExam } = useExamQuestions(id, !!application?.has_exam)

  const generateExam = useGenerateExam()
  const setResult = useSetResult()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!application) {
    return <NoData text="Ariza topilmadi" />
  }

  const statusCfg = APPLICATION_STATUS[application.status]
  const isFinished = application.status === 'PASSED' || application.status === 'FAILED'

  return (
    <div className="flex flex-col gap-3">
      <GoBack title={application.employee_name} fallbackPath="/attestation-calendars" />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{application.employee_name}</h2>
            <Badge variant="outline" className={EMPLOYEE_TYPE[application.employee_type].className}>
              {EMPLOYEE_TYPE[application.employee_type].label}
            </Badge>
            {statusCfg && <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem label="JSHSHIR" value={application.employee_pin} />
            <InfoItem label="Lavozimi" value={application.employee_position} />
            <InfoItem label="Yo‘nalish" value={DIRECTION[application.direction] ?? application.direction} />
            <InfoItem label="Tashkilot" value={application.organization_name} />

            {application.calendar && (
              <InfoItem
                label="Qabul vaqti"
                value={`${format(parseISO(application.calendar.start_date), 'dd.MM.yyyy HH:mm')}–${format(
                  parseISO(application.calendar.end_date),
                  'HH:mm'
                )}`}
              />
            )}

            {isFinished && (
              <>
                <InfoItem
                  label="Baholangan vaqt"
                  value={application.examined_at ? format(parseISO(application.examined_at), 'dd.MM.yyyy HH:mm') : null}
                />
                <InfoItem label="Baholagan xodim" value={application.examined_by_name} />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">Imtihon savollari</h3>

            {application.status === 'NEW' && (
              <Button
                size="sm"
                className="ml-auto"
                onClick={() => generateExam.mutate(application.id)}
                disabled={generateExam.isPending}
              >
                {generateExam.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ListChecks className="mr-2 h-4 w-4" />
                )}
                Savollarni generatsiya qilish
              </Button>
            )}
          </div>

          {!application.has_exam && (
            <p className="text-muted-foreground text-sm">
              Savollar hali generatsiya qilinmagan. Suhbat boshlanganda savollar tasodifiy tanlanadi.
            </p>
          )}

          {application.has_exam && isLoadingExam && (
            <div className="flex justify-center py-6">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          )}

          {application.has_exam && !isLoadingExam && (
            <ol className="space-y-2">
              {sessions.map((session) => (
                <li key={session.id} className="bg-muted/40 flex gap-3 rounded-md p-3 text-sm">
                  <span className="text-muted-foreground shrink-0 font-semibold">{session.order}.</span>
                  <span>{session.question?.question_text}</span>
                </li>
              ))}
            </ol>
          )}

          {application.status === 'SCHEDULED' && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="text-muted-foreground text-sm">Suhbat yakunlangach natijani belgilang:</span>

              <Button
                className="ml-auto bg-green-600 hover:bg-green-700"
                onClick={() => setResult.mutate({ applicationId: application.id, result: 'PASSED' })}
                disabled={setResult.isPending}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                O‘tdi
              </Button>

              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setResult.mutate({ applicationId: application.id, result: 'FAILED' })}
                disabled={setResult.isPending}
              >
                <XCircle className="mr-2 h-4 w-4" />
                O‘tmadi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
