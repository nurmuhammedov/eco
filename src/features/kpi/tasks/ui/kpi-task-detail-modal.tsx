import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { useGetKpiTask, useApproveResult, useRejectResult } from '../model/use-kpi-tasks'
import { Loader2, ExternalLink, CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  taskId: string | null
  onClose: () => void
}

// result endi object bo'lib keladi
interface ResultObj {
  id: string
  completion_percent: number
  note: string | null
  file_url: string | null
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
  hr_comment?: string | null
  submitted_at?: string | null
  reviewed_at?: string | null
  created_at?: string | null
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  DRAFT: { label: 'Qoralama', cls: 'bg-yellow-100 text-yellow-800' },
  PENDING: { label: 'Tekshiruvda', cls: 'bg-blue-100 text-blue-800' },
  APPROVED: { label: 'Tasdiqlandi', cls: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Rad etildi', cls: 'bg-red-100 text-red-800' },
}

function ResultCell({ indicatorId, result }: { indicatorId: string; result: ResultObj | number | null | undefined }) {
  const [rejectMode, setRejectMode] = useState(false)
  const [comment, setComment] = useState('')

  const approveMutation = useApproveResult()
  const rejectMutation = useRejectResult()

  if (result === null || result === undefined) {
    return <span className="text-gray-400">—</span>
  }

  // Eski format — natija raqam (number) bo'lsa
  if (typeof result === 'number') {
    return <Badge className="bg-green-500">{result}</Badge>
  }

  const handleApprove = () => {
    approveMutation.mutate({ indicatorId })
  }

  const handleReject = () => {
    if (!comment.trim()) return
    rejectMutation.mutate(
      { indicatorId, hr_comment: comment },
      {
        onSuccess: () => {
          setRejectMode(false)
          setComment('')
        },
      }
    )
  }

  // Yangi format — natija object bo'lsa
  const statusCfg = STATUS_LABELS[result.status] ?? { label: result.status, cls: 'bg-gray-100 text-gray-700' }
  const isPending = result.status === 'PENDING'

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{result.completion_percent}%</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.cls}`}>{statusCfg.label}</span>
      </div>

      {result.file_url && (
        <a
          href={result.file_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-0.5 text-xs text-blue-500 hover:underline"
        >
          <ExternalLink className="h-3 w-3" /> Faylni ko‘rish
        </a>
      )}

      {result.note && (
        <div
          className="w-full max-w-[200px] rounded bg-gray-50 p-1.5 text-right text-xs text-gray-500"
          title={result.note}
        >
          <strong className="block text-[10px] text-gray-400">Izoh:</strong>
          {result.note}
        </div>
      )}

      {result.hr_comment && (
        <div
          className={`mt-1 w-full max-w-[200px] rounded p-1.5 text-right text-xs ${result.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
        >
          <strong className="block text-[10px] opacity-70">HR javobi:</strong>
          {result.hr_comment}
        </div>
      )}

      {/* HR Actions for PENDING */}
      {isPending && !rejectMode && (
        <div className="mt-2 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-red-200 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setRejectMode(true)}
          >
            <XCircle className="mr-1 h-3 w-3" />
            Rad etish
          </Button>
          <Button
            size="sm"
            className="h-7 bg-green-600 text-xs hover:bg-green-700"
            onClick={handleApprove}
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

      {/* Reject Mode Form */}
      {isPending && rejectMode && (
        <div className="mt-2 w-full max-w-[250px] space-y-2 rounded-md border border-red-100 bg-red-50 p-2">
          <Textarea
            placeholder="Rad etish sababini yozing..."
            className="min-h-[60px] resize-none bg-white text-xs"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-gray-500"
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
              {rejectMutation.isPending ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
              Rad etish
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function KpiTaskDetailModal({ taskId, onClose }: Props) {
  const { data, isLoading } = useGetKpiTask(taskId ?? '')

  return (
    <Dialog open={!!taskId} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>KPI Vazifa tafsilotlari</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : data ? (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-4 gap-4 rounded-md bg-gray-50 p-3 text-sm">
              <div>
                <p className="text-gray-500">Bo‘lim</p>
                <p className="font-semibold">{data.department_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Yil</p>
                <p className="font-semibold">{data.year}</p>
              </div>
              <div>
                <p className="text-gray-500">Chorak</p>
                <p className="font-semibold">{data.quarter}-chorak</p>
              </div>
              <div>
                <p className="text-gray-500">KPI natijasi</p>
                <p
                  className={`font-bold ${data.completion_rate && data.completion_rate >= 75 ? 'text-green-600' : data.completion_rate && data.completion_rate >= 50 ? 'text-amber-500' : 'text-red-600'}`}
                >
                  {data.completion_rate ? data.completion_rate.toFixed(1) : '0'}%
                </p>
              </div>
            </div>

            {/* Indicators table */}
            <div>
              <h3 className="mb-2 font-semibold">Indikatorlar</h3>
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="w-8 p-2 text-left font-medium">T/R</th>
                      <th className="p-2 text-left font-medium">Indikator</th>
                      <th className="w-[120px] p-2 text-left font-medium">Turi</th>
                      <th className="w-[80px] p-2 text-center font-medium">Maqsad</th>
                      <th className="w-[80px] p-2 text-center font-medium">Jarima %</th>
                      <th className="min-w-[200px] p-2 text-right font-medium">Natija & Tasdiqlash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.indicators?.map((ind: any, idx: number) => (
                      <tr key={ind.id ?? idx} className="border-t align-top hover:bg-gray-50/30">
                        <td className="p-3 font-medium text-gray-500">{idx + 1}</td>
                        <td className="p-3">
                          <p className="font-medium">{ind.name}</p>
                          <div className="mt-1">
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                              Vazn: {ind.weight}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          {ind.calculation_type === 'PENALTY' ? (
                            <span className="rounded border border-red-100 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                              Xatolik (Jarima)
                            </span>
                          ) : (
                            <span className="rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                              Reja bo‘yicha
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center font-medium">{ind.target}</td>
                        <td className="p-3 text-center">
                          {ind.calculation_type === 'PENALTY' && ind.penalty_per_unit != null ? (
                            <span className="font-medium text-red-600">{ind.penalty_per_unit}%</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <ResultCell indicatorId={ind.id} result={ind.result} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
