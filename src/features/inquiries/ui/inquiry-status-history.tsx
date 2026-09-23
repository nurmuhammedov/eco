import { differenceInMinutes, format, parseISO } from 'date-fns'
import { Clock, History, UserRound } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { cn } from '@/shared/lib/utils'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { InquiryStatus, inquiryStatusLabels } from '../model/types'

export interface InquiryStatusStep {
  id: string
  status: InquiryStatus | string
  description: string | null
  createdAt: string
  executorName: string | null
}

interface Props {
  steps?: InquiryStatusStep[]
  /** The inquiry itself: its filing is the NEW step, which the history does not record */
  submittedAt?: string
}

const formatGap = (from: string, to: string) => {
  const minutes = differenceInMinutes(parseISO(to), parseISO(from))
  if (minutes < 1) return 'bir daqiqadan kam'

  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const rest = minutes % 60

  return [days && `${days} kun`, hours && `${hours} soat`, !days && rest && `${rest} daqiqa`].filter(Boolean).join(' ')
}

/** When the inquiry moved into each status, who moved it and how long the previous one lasted. */
export const InquiryStatusHistory = ({ steps = [], submittedAt }: Props) => {
  const timeline: InquiryStatusStep[] = [
    ...(submittedAt
      ? [{ id: 'submitted', status: InquiryStatus.NEW, description: null, createdAt: submittedAt, executorName: null }]
      : []),
    ...[...steps].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  ]

  if (timeline.length === 0) return <EmptyValue />

  return (
    <ol className="relative py-2 pl-2">
      {timeline.map((step, index) => {
        const previous = timeline[index - 1]
        const isLast = index === timeline.length - 1
        const isRejected = String(step.status) === String(InquiryStatus.REJECTED)

        return (
          <li key={step.id} className="relative flex gap-4 pb-5 last:pb-1">
            {!isLast && <span className="bg-border absolute top-5 left-[7px] h-full w-px" aria-hidden />}

            <span
              className={cn(
                'relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 bg-white',
                isLast ? (isRejected ? 'border-red-500 bg-red-500' : 'border-teal bg-teal') : 'border-teal'
              )}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className={cn('text-sm font-semibold', isRejected && 'text-red-600')}>
                  {inquiryStatusLabels[step.status] ?? step.status}
                </span>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {format(parseISO(step.createdAt), 'dd.MM.yyyy HH:mm')}
                </span>
              </div>

              <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {step.executorName && (
                  <span className="flex items-center gap-1">
                    <UserRound className="h-3.5 w-3.5" />
                    {step.executorName}
                  </span>
                )}
                {previous && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    oldingi holatdan {formatGap(previous.createdAt, step.createdAt)} o‘tib
                  </span>
                )}
              </div>

              {step.description && <p className="mt-1.5 text-sm">{step.description}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/** The history behind a header button, so it stays at hand without taking room on the page. */
export const InquiryStatusHistoryModal = (props: Props) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
        <History className="mr-2 h-4 w-4" />
        Amallar tarixi
      </Button>
    </DialogTrigger>
    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Amallar tarixi</DialogTitle>
      </DialogHeader>
      <InquiryStatusHistory {...props} />
    </DialogContent>
  </Dialog>
)
