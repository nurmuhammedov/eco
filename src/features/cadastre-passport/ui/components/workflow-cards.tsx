import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, History } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import FileLink from '@/shared/components/common/file-link'
import { cn } from '@/shared/lib/utils'
import { WORKFLOW_HISTORY_LABELS, WORKFLOW_STATUS } from '../../model/labels'
import { WorkflowInstance } from '../../model/types'
import { useWorkflowHistory } from '../../model/use-cadastre-passport'

const dateTime = (value: string | null) => (value ? format(new Date(value), 'dd.MM.yyyy HH:mm') : '')

const HistoryTimeline = ({ instanceId }: { instanceId: string }) => {
  const { data, isLoading } = useWorkflowHistory(instanceId)

  if (isLoading) return <p className="text-muted-foreground text-sm">Yuklanmoqda...</p>
  if (!data?.length) return <p className="text-muted-foreground text-sm">Hali harakatlar qayd etilmagan</p>

  return (
    <ol className="space-y-4 border-l border-neutral-200 pl-5">
      {data.map((entry, index) => (
        <li key={`${entry.createdAt}-${index}`} className="relative space-y-1">
          <span
            className={cn(
              'absolute top-1.5 -left-[25px] size-2.5 rounded-full ring-4 ring-white',
              entry.action === 'RETURN' || entry.action === 'REJECT' ? 'bg-red-500' : 'bg-teal'
            )}
          />
          <p className="text-sm font-medium text-neutral-900">
            {WORKFLOW_HISTORY_LABELS[entry.action] ?? entry.action}
          </p>
          <p className="text-muted-foreground text-xs">
            {[`${entry.stepOrder}-pog‘ona`, entry.positionName, entry.actorName, dateTime(entry.createdAt)]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {entry.comment && (
            <p className="rounded-md bg-neutral-50 px-3 py-2 text-sm whitespace-pre-line text-neutral-800">
              {entry.comment}
            </p>
          )}
          {entry.filePath && <FileLink url={entry.filePath} title="Faylni ko‘rish" />}
        </li>
      ))}
    </ol>
  )
}

const WorkflowCard = ({ workflow }: { workflow: WorkflowInstance }) => {
  const [open, setOpen] = useState(false)

  const status = WORKFLOW_STATUS[workflow.status]
  const isDone = workflow.status === 'COMPLETED'
  const passed = isDone ? workflow.totalSteps : Math.max(0, workflow.currentStep - 1)
  const percent = workflow.totalSteps ? Math.round((passed / workflow.totalSteps) * 100) : 0

  return (
    <div
      className={cn(
        'rounded-xl border bg-white p-4',
        workflow.myTurn ? 'border-teal/50 ring-teal/20 ring-1' : 'border-neutral-200'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium">{workflow.slot}</p>
          <p className="font-semibold text-neutral-900">{workflow.orgName}</p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          {workflow.myTurn && <Badge variant="info">Sizning navbatingiz</Badge>}
          {status && <Badge variant={status.variant}>{status.label}</Badge>}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate text-neutral-600">
            {workflow.status === 'IN_PROGRESS' && workflow.currentPositionName
              ? `Hozir: ${workflow.currentPositionName}`
              : 'Pog‘onalar'}
          </span>
          <span className="shrink-0 font-medium text-neutral-900 tabular-nums">
            {isDone ? workflow.totalSteps : workflow.currentStep} / {workflow.totalSteps}
          </span>
        </div>
        <Progress value={percent} className="h-1.5" />
      </div>

      <Collapsible open={open} onOpenChange={setOpen} className="mt-3">
        <CollapsibleTrigger className="text-teal flex cursor-pointer items-center gap-1.5 text-sm font-medium hover:underline">
          <History className="size-4" />
          Harakatlar tarixi
          <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">{open && <HistoryTimeline instanceId={workflow.id} />}</CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export const WorkflowCards = ({ workflows }: { workflows: WorkflowInstance[] }) => {
  if (!workflows.length) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        Tashkilotlar ko‘rib chiqishi buyurtmachi tasdiqlagandan keyin boshlanadi
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  )
}
