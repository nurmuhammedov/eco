import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import { AlertCircle, CheckCircle2, Clock, FileUp, Loader2, Send, XCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useGetMyKpiTask, useCreateResult, useUpdateResult, useSubmitKpiTask } from '../model/use-my-kpi'
import { MyKpiIndicator } from '../api/my-kpi.api'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  DRAFT: { label: 'Qoralama', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PENDING: { label: 'Tekshiruvda', color: 'bg-blue-100 text-blue-800', icon: Clock },
  APPROVED: { label: 'Tasdiqlandi', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  REJECTED: { label: 'Rad etildi', color: 'bg-red-100 text-red-800', icon: XCircle },
} as const

// ─── Result Form Schema ───────────────────────────────────────────────────────

const resultSchema = z.object({
  achieved_value: z.coerce.number().min(0, 'Min 0'),
  note: z.string().optional(),
  file: z.any().optional(),
})
type ResultFormValues = z.infer<typeof resultSchema>

// ─── Result Modal ─────────────────────────────────────────────────────────────

interface ResultModalProps {
  indicator: MyKpiIndicator | null
  year: number
  quarter: number
  onClose: () => void
}

function ResultModal({ indicator, year, quarter, onClose }: ResultModalProps) {
  const isEditing = !!indicator?.result
  const canEdit = !indicator?.result || indicator.result.status === 'DRAFT' || indicator.result.status === 'REJECTED'

  const createResult = useCreateResult(year, quarter)
  const updateResult = useUpdateResult(year, quarter)
  const isPending = createResult.isPending || updateResult.isPending

  let defaultAchievedValue = 0
  if (indicator?.result) {
    const comp = indicator.result.completion_percent
    if (indicator.calculation_type === 'PLAN') {
      defaultAchievedValue = (comp / 100) * indicator.target
    } else if (indicator.calculation_type === 'PENALTY') {
      const penalty = indicator.penalty_per_unit || 100
      defaultAchievedValue = (100 - comp) / penalty
    }
  }

  const form = useForm<ResultFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      achieved_value: defaultAchievedValue,
      note: indicator?.result?.note ?? '',
    },
  })

  const onSubmit = (values: ResultFormValues) => {
    const file = values.file?.[0] as File | undefined

    let completion_percent = 0
    if (indicator!.calculation_type === 'PLAN') {
      const target = indicator!.target > 0 ? indicator!.target : 1
      completion_percent = Math.min(100, Math.max(0, (values.achieved_value / target) * 100))
    } else if (indicator!.calculation_type === 'PENALTY') {
      const penalty = indicator!.penalty_per_unit || 100
      completion_percent = Math.max(0, 100 - values.achieved_value * penalty)
    }

    if (isEditing && indicator?.result) {
      updateResult.mutate(
        { resultId: indicator.result.id, dto: { completion_percent, note: values.note, file } },
        { onSuccess: onClose }
      )
    } else {
      createResult.mutate(
        { kpi_indicator_id: indicator!.id, completion_percent, note: values.note, file },
        { onSuccess: onClose }
      )
    }
  }

  if (!indicator) return null

  const resultStatus = indicator.result?.status
  const statusCfg = resultStatus ? STATUS_CONFIG[resultStatus] : null

  return (
    <Dialog open={!!indicator} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug">Natija kiritish</DialogTitle>
          <p className="text-muted-foreground mt-1 text-sm font-medium">{indicator.name}</p>
        </DialogHeader>

        {/* Joriy holat */}
        {statusCfg && (
          <div className={cn('flex items-center gap-2 rounded-md px-3 py-2 text-sm', statusCfg.color)}>
            <statusCfg.icon className="h-4 w-4" />
            <span>
              Joriy holat: <strong>{statusCfg.label}</strong>
            </span>
            {resultStatus === 'PENDING' && (
              <span className="ml-auto text-xs">(HR tekshiruvida — tahrirlash mumkin emas)</span>
            )}
          </div>
        )}

        {/* Form */}
        {canEdit ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Erishilgan natija */}
              <FormField
                control={form.control}
                name="achieved_value"
                render={({ field }) => {
                  const achieved = Number(field.value) || 0
                  let computed_percent = 0
                  if (indicator.calculation_type === 'PLAN') {
                    computed_percent =
                      indicator.target > 0 ? Math.min(100, Math.max(0, (achieved / indicator.target) * 100)) : 100
                  } else {
                    const penalty = indicator.penalty_per_unit || 100
                    computed_percent = Math.max(0, 100 - achieved * penalty)
                  }
                  const kpi_weight_score = (computed_percent / 100) * indicator.weight

                  return (
                    <FormItem>
                      <FormLabel>Erishilgan natija (Maqsad soni) *</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Input type="number" min={0} placeholder="0" {...field} />
                          <div className="bg-muted/50 space-y-2 rounded-md p-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Hisoblangan bajarilish foizi:</span>
                              <span className="font-medium">{computed_percent.toFixed(1)}%</span>
                            </div>
                            <Progress value={computed_percent} className="h-1.5" />
                            <div className="flex justify-between border-t pt-1 text-sm">
                              <span className="text-muted-foreground">Vazn bo‘yicha KPI ko‘rsatkichi:</span>
                              <span className="text-primary font-bold">
                                {kpi_weight_score.toFixed(1)}% / {indicator.weight}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              {/* Izoh */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Izoh (ixtiyoriy)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Qo‘shimcha ma’lumot..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fayl */}
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <FileUp className="h-4 w-4" />
                      Tasdiqlovchi hujjat (ixtiyoriy)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    {indicator.result?.file_url && (
                      <a
                        href={indicator.result.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 underline"
                      >
                        Avvalgi fayl
                      </a>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            Bu natijani tahrirlash mumkin emas (holat: {statusCfg?.label}).
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MyKpiPage() {
  const currentYear = new Date().getFullYear()
  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)

  const [year, setYear] = useState(currentYear)
  const [quarter, setQuarter] = useState(currentQuarter)
  const [selectedIndicator, setSelectedIndicator] = useState<MyKpiIndicator | null>(null)

  const { data: task, isLoading } = useGetMyKpiTask(year, quarter)
  const submitTask = useSubmitKpiTask(year, quarter)

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i)

  // Barcha indikatorlarda natija kiritilganmi?
  const allFilled = task?.indicators?.every((ind) => ind.result !== null) ?? false

  // Qaysidir indikator hozirda tekshiruvda bo'lsa (HR ga yuborilgan bo'lsa)
  const isAnyPendingOrApproved =
    task?.indicators?.some((ind) => ind.result?.status === 'PENDING' || ind.result?.status === 'APPROVED') ?? false

  // Submit tugmasi ko'rinadimi?
  const invalidSubmitStatuses = ['Tekshiruvda', 'Tasdiqlangan', 'PENDING', 'APPROVED']
  const canSubmit = allFilled && !isAnyPendingOrApproved && !invalidSubmitStatuses.includes(task?.status_text ?? '')

  const getResultStatus = (ind: MyKpiIndicator) => {
    if (!ind.result) return null
    return STATUS_CONFIG[ind.result.status] ?? null
  }

  return (
    <div className="container mx-auto space-y-4">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {/* Filter */}
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

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      )}

      {/* No data */}
      {!isLoading && !task && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="text-muted-foreground mb-3 h-10 w-10" />
          <p className="text-muted-foreground text-lg font-medium">Bu chorak uchun KPI vazifa topilmadi</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {year}-yil {quarter}-chorak uchun HR tomonidan vazifa belgilanmagan.
          </p>
        </div>
      )}

      {/* Task card */}
      {!isLoading && task && (
        <div className="space-y-4">
          {/* Summary card */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">Bo‘lim</p>
                <p className="text-lg font-semibold">{task.department_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  {year}-yil {quarter}-chorak
                </Badge>
                <Badge
                  className={cn(
                    'px-3 py-1 text-sm',
                    task.status_text === 'Tasdiqlangan'
                      ? 'bg-green-100 text-green-800'
                      : task.status_text === 'Tekshiruvda'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                  )}
                >
                  {task.status_text}
                </Badge>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-muted-foreground">Umumiy bajarilish</span>
                <span
                  className={cn(
                    'font-bold',
                    (task.completion_rate ?? 0) >= 75
                      ? 'text-green-600'
                      : (task.completion_rate ?? 0) >= 50
                        ? 'text-amber-500'
                        : 'text-red-600'
                  )}
                >
                  {task.completion_rate?.toFixed(1) ?? 0}%
                </span>
              </div>
              <Progress
                value={task.completion_rate ?? 0}
                className={cn(
                  'h-2.5',
                  (task.completion_rate ?? 0) >= 75
                    ? '[&>div]:bg-green-600'
                    : (task.completion_rate ?? 0) >= 50
                      ? '[&>div]:bg-amber-500'
                      : '[&>div]:bg-red-600'
                )}
              />
            </div>

            {/* Submit button */}
            {canSubmit && (
              <div className="mt-4 border-t pt-4">
                <Button
                  className="w-full gap-2"
                  onClick={() => submitTask.mutate(task.id)}
                  disabled={submitTask.isPending}
                >
                  {submitTask.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  HR ga yuborish (Tekshiruvga topshirish)
                </Button>
              </div>
            )}

            {!allFilled && (
              <div className="mt-3 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-sm text-amber-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Yuborish uchun barcha indikatorlarga natija kiritish shart.
              </div>
            )}
          </div>

          {/* Indicators list */}
          <div className="space-y-2">
            <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Indikatorlar ({task.indicators?.length ?? 0} ta)
            </h2>

            {task.indicators?.map((ind, idx) => {
              const statusCfg = getResultStatus(ind)
              const hasResult = !!ind.result
              const canEditResult = !ind.result || ind.result.status === 'DRAFT' || ind.result.status === 'REJECTED'

              return (
                <div
                  key={ind.id}
                  className={cn(
                    'flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all sm:flex-row sm:items-center',
                    hasResult ? 'border-green-200' : 'border-gray-200'
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span className="text-muted-foreground mt-0.5 w-6 shrink-0 text-sm font-bold">{idx + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{ind.name}</p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="text-muted-foreground text-xs">Maqsad: {ind.target}</span>
                        <span className="text-muted-foreground text-xs">Vazn: {ind.weight}%</span>
                        <span className="text-muted-foreground text-xs">
                          Tur:{' '}
                          <span className="text-foreground font-medium">
                            {ind.calculation_type === 'PENALTY' ? 'Jarima' : 'Reja'}
                          </span>
                        </span>
                        {ind.calculation_type === 'PENALTY' && (
                          <span className="text-xs font-medium text-red-500">
                            (Har biriga -{ind.penalty_per_unit || 100}%)
                          </span>
                        )}
                      </div>

                      {ind.result && (
                        <div className="mt-3 flex flex-wrap items-center gap-3 border-t pt-3">
                          <div className="flex w-[120px] items-center gap-2">
                            <Progress value={ind.result.completion_percent} className="h-1.5 flex-1" />
                            <span className="shrink-0 text-xs font-semibold">{ind.result.completion_percent}%</span>
                          </div>
                          {ind.result.note && (
                            <span className="text-muted-foreground max-w-[200px] truncate text-xs">
                              Izoh: {ind.result.note}
                            </span>
                          )}
                          {ind.result.file_url && (
                            <a
                              href={ind.result.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                              <FileUp className="h-3.5 w-3.5" />
                              Fayl
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-9 flex shrink-0 items-center gap-3 sm:ml-0">
                    {statusCfg ? (
                      <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-medium', statusCfg.color)}>
                        {statusCfg.label}
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        Kiritilmagan
                      </span>
                    )}

                    <Button
                      size="sm"
                      variant={hasResult && !canEditResult ? 'secondary' : 'outline'}
                      disabled={!canEditResult}
                      onClick={() => setSelectedIndicator(ind)}
                      className="h-8 shrink-0 text-xs"
                    >
                      {!hasResult && 'Natija kiritish'}
                      {hasResult && canEditResult && 'Tahrirlash'}
                      {hasResult && !canEditResult && 'Tahrirlab bo‘lmaydi'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Result modal */}
      <ResultModal
        indicator={selectedIndicator}
        year={year}
        quarter={quarter}
        onClose={() => setSelectedIndicator(null)}
      />
    </div>
  )
}
