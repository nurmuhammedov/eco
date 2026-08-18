import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Loader2, Send } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { NoData } from '@/shared/components/common/no-data'
import { FileLink } from '@/shared/components/common/file-link'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { cn } from '@/shared/lib/utils'
import {
  completionBarColor,
  completionColor,
  isResultEditable,
  KPI_CALCULATION_TYPE,
  KPI_RESULT_STATUS,
  KPI_TASK_STATUS,
  type KpiIndicator,
} from '@/entities/kpi'
import { useGetMyKpiTask, useCreateResult, useUpdateResult, useSubmitKpiTask } from '../model/use-my-kpi'

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Label of the value the user enters, depending on the indicator type.
const valueLabel = (indicator: KpiIndicator) =>
  indicator.calculation_type === 'PENALTY' ? 'Qayd etilgan xatoliklar soni' : 'Erishilgan natija'

// Live preview only; the stored percentage is calculated by the backend.
const previewPercent = (indicator: KpiIndicator, achieved: number): number => {
  if (indicator.calculation_type === 'PENALTY') {
    const penalty = indicator.penalty_per_unit || 100
    return Math.max(0, 100 - achieved * penalty)
  }

  if (indicator.target <= 0) return achieved > 0 ? 100 : 0

  return Math.min(100, (achieved / indicator.target) * 100)
}

// ─── Result modal ────────────────────────────────────────────────────────────

const resultSchema = z.object({
  achieved_value: z
    .union([z.number(), z.string()])
    .refine((v) => v !== '' && v !== null && v !== undefined, 'Majburiy maydon!')
    .refine((v) => !isNaN(Number(v)), 'Kiritilgan ma’lumot yaroqli emas!')
    .refine((v) => Number(v) >= 0, 'Kiritilgan ma’lumot yaroqli emas!')
    .transform(Number),
  note: z.string().max(2000, 'Kiritilgan ma’lumot yaroqli emas!').optional(),
  file_url: z.string().max(500).nullable().optional(),
})

type ResultFormValues = z.infer<typeof resultSchema>

interface ResultModalProps {
  indicator: KpiIndicator | null
  year: number
  quarter: number
  onClose: () => void
}

function ResultModal({ indicator, year, quarter, onClose }: ResultModalProps) {
  const createResult = useCreateResult(year, quarter)
  const updateResult = useUpdateResult(year, quarter)
  const isPending = createResult.isPending || updateResult.isPending

  const form = useForm<ResultFormValues>({
    resolver: zodResolver(resultSchema),
    values: {
      achieved_value: indicator?.result?.achieved_value ?? '',
      note: indicator?.result?.note ?? '',
      file_url: indicator?.result?.file_url ?? null,
    } as never,
  })

  const achieved = Number(form.watch('achieved_value')) || 0

  if (!indicator) return null

  const result = indicator.result
  const statusCfg = result ? KPI_RESULT_STATUS[result.status] : null
  const canEdit = isResultEditable(result?.status)

  const computedPercent = previewPercent(indicator, achieved)
  const weightedScore = (computedPercent / 100) * indicator.weight

  const onSubmit = (values: ResultFormValues) => {
    const dto = { achieved_value: values.achieved_value, note: values.note, file_url: values.file_url ?? null }

    if (result) {
      updateResult.mutate({ resultId: result.id, dto }, { onSuccess: onClose })
    } else {
      createResult.mutate({ indicatorId: indicator.id, dto }, { onSuccess: onClose })
    }
  }

  return (
    <Dialog open={!!indicator} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug">Natija kiritish</DialogTitle>
          <p className="text-muted-foreground mt-1 text-sm font-medium">{indicator.name}</p>
        </DialogHeader>

        {statusCfg && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Joriy holat:</span>
              <Badge variant={statusCfg.variant} className="gap-1">
                <statusCfg.icon className="h-3.5 w-3.5" />
                {statusCfg.label}
              </Badge>
            </div>

            {result?.hr_comment && (
              <div
                className={cn(
                  'rounded-md border p-3 text-sm',
                  result.status === 'REJECTED'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-green-200 bg-green-50 text-green-700'
                )}
              >
                <p className="mb-0.5 text-xs font-semibold opacity-80">
                  Tasdiqlovchi izohi{result.reviewed_by_name ? ` — ${result.reviewed_by_name}` : ''}
                </p>
                {result.hr_comment}
              </div>
            )}
          </div>
        )}

        {canEdit ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="achieved_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>
                      {valueLabel(indicator)}
                      {indicator.calculation_type === 'PLAN' && (
                        <span className="text-muted-foreground ml-1 font-normal">(reja: {indicator.target})</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="any" placeholder="0" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />

                    <div className="bg-muted/50 mt-2 space-y-2 rounded-md p-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Bajarilish foizi:</span>
                        <span className="font-medium">{computedPercent.toFixed(1)}%</span>
                      </div>
                      <Progress value={computedPercent} className={cn('h-1.5', completionBarColor(computedPercent))} />
                      <div className="flex justify-between border-t pt-2 text-sm">
                        <span className="text-muted-foreground">Vazn bo‘yicha ball:</span>
                        <span className="text-primary font-bold">
                          {weightedScore.toFixed(1)} / {indicator.weight}
                        </span>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Izoh</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Qo‘shimcha ma’lumot..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Tasdiqlovchi hujjat</FormLabel>
                <InputFile
                  form={form}
                  name="file_url"
                  buttonText="Hujjatni tanlang"
                  accept={[FileTypes.IMAGE, FileTypes.PDF, FileTypes.DOC, FileTypes.EXCEL]}
                />
              </FormItem>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Saqlash
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-muted-foreground flex items-center gap-2 py-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            Tekshiruvga yuborilgan natijani tahrirlash mumkin emas.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function MyKpiPage() {
  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)

  const [year, setYear] = useState(currentYear)
  const [quarter, setQuarter] = useState(currentQuarter)
  const [selectedIndicator, setSelectedIndicator] = useState<KpiIndicator | null>(null)

  const { data: task, isLoading } = useGetMyKpiTask(year, quarter)
  const submitTask = useSubmitKpiTask(year, quarter)

  const years = useMemo(() => Array.from({ length: 5 }, (_, i) => currentYear - 1 + i), [currentYear])

  const indicators = task?.indicators ?? []
  const allFilled = indicators.length > 0 && indicators.every((ind) => ind.result !== null)

  // Submit is offered once every indicator is filled and at least one is still editable.
  const hasSubmittable = indicators.some((ind) => ind.result && isResultEditable(ind.result.status))
  const canSubmit = allFilled && hasSubmittable

  const taskStatusCfg = task ? KPI_TASK_STATUS[task.status] : null

  return (
    <div className="container mx-auto space-y-4">
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-3">
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="h-9 w-28 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}-yil
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(quarter)} onValueChange={(v) => setQuarter(Number(v))}>
            <SelectTrigger className="h-9 w-32 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((q) => (
                <SelectItem key={q} value={String(q)}>
                  {q}-chorak
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      )}

      {!isLoading && !task && <NoData text={`${year}-yil ${quarter}-chorak uchun KPI vazifa belgilanmagan`} />}

      {!isLoading && task && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">Bo‘lim</p>
                <p className="text-lg font-semibold">{task.department_name}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  {task.year}-yil {task.quarter}-chorak
                </Badge>
                {taskStatusCfg && (
                  <Badge variant={taskStatusCfg.variant} className="gap-1 px-3 py-1 text-sm">
                    <taskStatusCfg.icon className="h-3.5 w-3.5" />
                    {taskStatusCfg.label}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-muted-foreground">Umumiy bajarilish</span>
                <span className={cn('font-bold', completionColor(task.completion_rate))}>
                  {task.completion_rate.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={task.completion_rate}
                className={cn('h-2.5', completionBarColor(task.completion_rate))}
              />
              <p className="text-muted-foreground mt-2 text-xs">
                {task.submitted_count} / {task.indicator_count} indikatorga natija kiritilgan
              </p>
            </div>

            {canSubmit && (
              <div className="mt-4 border-t pt-4">
                <Button
                  className="w-full gap-2"
                  onClick={() => submitTask.mutate(task.id)}
                  disabled={submitTask.isPending}
                >
                  {submitTask.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Tekshiruvga topshirish
                </Button>
              </div>
            )}

            {!allFilled && (
              <div className="mt-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-sm text-amber-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Topshirish uchun barcha indikatorlarga natija kiritilishi shart.
              </div>
            )}
          </div>

          {/* Indicators */}
          <div className="space-y-2">
            <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Indikatorlar ({indicators.length} ta)
            </h2>

            {indicators.map((ind, idx) => {
              const result = ind.result
              const statusCfg = result ? KPI_RESULT_STATUS[result.status] : null
              const canEdit = isResultEditable(result?.status)

              return (
                <div
                  key={ind.id}
                  className="bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm transition-colors sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span className="text-muted-foreground mt-0.5 w-6 shrink-0 text-sm font-bold">{idx + 1}</span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{ind.name}</p>

                      <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span>Reja: {ind.target}</span>
                        <span>Vazn: {ind.weight}</span>
                        <span>
                          Tur:{' '}
                          <span className="text-foreground font-medium">
                            {KPI_CALCULATION_TYPE[ind.calculation_type].short}
                          </span>
                        </span>
                        {ind.calculation_type === 'PENALTY' && (
                          <span className="font-medium text-red-500">
                            Har bir xatolik −{ind.penalty_per_unit ?? 100}%
                          </span>
                        )}
                      </div>

                      {result && (
                        <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3">
                          <div className="flex w-[140px] items-center gap-2">
                            <Progress
                              value={result.completion_percent}
                              className={cn('h-1.5 flex-1', completionBarColor(result.completion_percent))}
                            />
                            <span className="shrink-0 text-xs font-semibold">{result.completion_percent}%</span>
                          </div>

                          {result.achieved_value !== null && (
                            <span className="text-muted-foreground text-xs">
                              {valueLabel(ind)}:{' '}
                              <span className="text-foreground font-medium">{result.achieved_value}</span>
                            </span>
                          )}

                          {result.note && (
                            <span className="text-muted-foreground max-w-[220px] truncate text-xs" title={result.note}>
                              Izoh: {result.note}
                            </span>
                          )}

                          {result.file_url && <FileLink url={result.file_url} title="Hujjat" isSmall />}
                        </div>
                      )}

                      {result?.status === 'REJECTED' && result.hr_comment && (
                        <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                          <span className="font-semibold">Qaytarilish sababi: </span>
                          {result.hr_comment}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-9 flex shrink-0 items-center gap-3 sm:ml-0">
                    {statusCfg ? (
                      <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                    ) : (
                      <Badge variant="secondary">Kiritilmagan</Badge>
                    )}

                    {/* Opens read-only too, so the reviewer comment stays visible */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedIndicator(ind)}
                      className="h-8 shrink-0 text-xs"
                    >
                      {!result ? 'Natija kiritish' : canEdit ? 'Tahrirlash' : 'Ko‘rish'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <ResultModal
        indicator={selectedIndicator}
        year={year}
        quarter={quarter}
        onClose={() => setSelectedIndicator(null)}
      />
    </div>
  )
}
