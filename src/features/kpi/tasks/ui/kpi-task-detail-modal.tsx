import { useState } from 'react'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { Progress } from '@/shared/components/ui/progress'
import { FileLink } from '@/shared/components/common/file-link'
import { cn } from '@/shared/lib/utils'
import {
  completionBarColor,
  completionColor,
  KPI_CALCULATION_TYPE,
  KPI_RESULT_STATUS,
  KPI_TASK_STATUS,
  type KpiIndicator,
} from '@/entities/kpi'
import { useGetKpiTask, useApproveResult, useRejectResult } from '../model/use-kpi-tasks'

interface Props {
  taskId: string | null
  onClose: () => void
}

// ─── Result cell with review actions ─────────────────────────────────────────

function ResultCell({ indicator }: { indicator: KpiIndicator }) {
  const [rejectMode, setRejectMode] = useState(false)
  const [comment, setComment] = useState('')

  const approveMutation = useApproveResult()
  const rejectMutation = useRejectResult()

  const result = indicator.result

  if (!result) {
    return <span className="text-muted-foreground text-sm">Kiritilmagan</span>
  }

  const statusCfg = KPI_RESULT_STATUS[result.status]
  const isPending = result.status === 'PENDING'

  const handleReject = () => {
    if (!comment.trim()) return

    rejectMutation.mutate(
      { indicatorId: indicator.id, hr_comment: comment },
      {
        onSuccess: () => {
          setRejectMode(false)
          setComment('')
        },
      }
    )
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{result.completion_percent}%</span>
        {statusCfg && (
          <Badge variant={statusCfg.variant} className="gap-1">
            <statusCfg.icon className="h-3.5 w-3.5" />
            {statusCfg.label}
          </Badge>
        )}
      </div>

      {result.achieved_value !== null && (
        <span className="text-muted-foreground text-xs">
          Kiritilgan qiymat: <span className="text-foreground font-medium">{result.achieved_value}</span>
        </span>
      )}

      {result.file_url && <FileLink url={result.file_url} title="Hujjat" isSmall />}

      {result.note && (
        <div className="bg-muted/60 w-full max-w-[220px] rounded p-1.5 text-right text-xs" title={result.note}>
          <span className="text-muted-foreground block text-[10px]">Bo‘lim izohi:</span>
          {result.note}
        </div>
      )}

      {result.hr_comment && (
        <div
          className={cn(
            'w-full max-w-[220px] rounded p-1.5 text-right text-xs',
            result.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          )}
        >
          <span className="block text-[10px] opacity-70">
            Javob{result.reviewed_by_name ? ` — ${result.reviewed_by_name}` : ''}:
          </span>
          {result.hr_comment}
        </div>
      )}

      {isPending && !rejectMode && (
        <div className="mt-1 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-red-200 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setRejectMode(true)}
            disabled={approveMutation.isPending}
          >
            <XCircle className="mr-1 h-3 w-3" />
            Qaytarish
          </Button>
          <Button
            size="sm"
            className="h-7 bg-green-600 text-xs hover:bg-green-700"
            onClick={() => approveMutation.mutate({ indicatorId: indicator.id })}
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-1 h-3 w-3" />
            )}
            Tasdiqlash
          </Button>
        </div>
      )}

      {isPending && rejectMode && (
        <div className="mt-1 w-full max-w-[260px] space-y-2 rounded-md border border-red-100 bg-red-50 p-2">
          <Textarea
            placeholder="Qaytarish sababini yozing..."
            className="bg-card min-h-[60px] resize-none text-xs"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- the dialog opens for this field alone
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => {
                setRejectMode(false)
                setComment('')
              }}
              disabled={rejectMutation.isPending}
            >
              Bekor qilish
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-6 px-2 text-xs"
              onClick={handleReject}
              disabled={!comment.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              Qaytarish
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function KpiTaskDetailModal({ taskId, onClose }: Props) {
  const { data: task, isLoading } = useGetKpiTask(taskId ?? '')

  const statusCfg = task ? KPI_TASK_STATUS[task.status] : null

  return (
    <Dialog open={!!taskId} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>KPI vazifa tafsilotlari</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}

        {!isLoading && task && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-muted/50 grid grid-cols-2 gap-4 rounded-md p-3 text-sm sm:grid-cols-4">
              <div>
                <p className="text-muted-foreground text-xs">Bo‘lim</p>
                <p className="font-semibold">{task.department_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Davr</p>
                <p className="font-semibold">
                  {task.year}-yil {task.quarter}-chorak
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Holati</p>
                {statusCfg ? (
                  <Badge variant={statusCfg.variant} className="mt-0.5 gap-1">
                    <statusCfg.icon className="h-3.5 w-3.5" />
                    {statusCfg.label}
                  </Badge>
                ) : (
                  <p className="font-semibold">{task.status_text}</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-xs">KPI natijasi</p>
                <div className="mt-1 flex items-center gap-2">
                  <Progress
                    value={task.completion_rate}
                    className={cn('h-1.5 flex-1', completionBarColor(task.completion_rate))}
                  />
                  <span className={cn('shrink-0 font-bold', completionColor(task.completion_rate))}>
                    {task.completion_rate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div>
              <h3 className="mb-2 font-semibold">Indikatorlar</h3>
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="w-8 p-2 text-left font-medium">№</th>
                      <th className="p-2 text-left font-medium">Indikator</th>
                      <th className="w-[130px] p-2 text-left font-medium">Turi</th>
                      <th className="w-[80px] p-2 text-center font-medium">Reja</th>
                      <th className="w-[90px] p-2 text-center font-medium">Jarima</th>
                      <th className="min-w-[220px] p-2 text-right font-medium">Natija va tasdiqlash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.indicators?.map((indicator, idx) => (
                      <tr key={indicator.id} className="hover:bg-muted/30 border-t align-top">
                        <td className="text-muted-foreground p-3 font-medium">{idx + 1}</td>
                        <td className="p-3">
                          <p className="font-medium">{indicator.name}</p>
                          <span className="bg-muted text-muted-foreground mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium">
                            Vazn: {indicator.weight}
                          </span>
                        </td>
                        <td className="p-3">
                          <Badge variant={KPI_CALCULATION_TYPE[indicator.calculation_type].variant}>
                            {KPI_CALCULATION_TYPE[indicator.calculation_type].label}
                          </Badge>
                        </td>
                        <td className="p-3 text-center font-medium">{indicator.target}</td>
                        <td className="p-3 text-center">
                          {indicator.calculation_type === 'PENALTY' && indicator.penalty_per_unit != null ? (
                            <span className="font-medium text-red-600">−{indicator.penalty_per_unit}%</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <ResultCell indicator={indicator} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
