import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCreateKpiTask, useUpdateKpiTask } from '../model/use-kpi-tasks'
import { useGetDepartments } from '@/features/kpi/departments/model/use-departments'
import { KPI_CALCULATION_TYPE, type KpiIndicator, type KpiTaskDetail } from '@/entities/kpi'
import { cn } from '@/shared/lib/utils'

export const CALC_TYPE_OPTIONS = [
  { value: 'PLAN', label: KPI_CALCULATION_TYPE.PLAN.label },
  { value: 'PENALTY', label: KPI_CALCULATION_TYPE.PENALTY.label },
] as const

export type CalcType = 'PLAN' | 'PENALTY'

// ─── Schema ──────────────────────────────────────────────────────────────────
const indicatorSchema = z
  .object({
    name: z.string().min(1, 'Majburiy maydon!'),
    calculation_type: z.enum(['PLAN', 'PENALTY'], { required_error: 'Majburiy maydon!' }),
    target: z.coerce.number().min(0, 'Kiritilgan ma’lumot yaroqli emas!'),
    penalty_per_unit: z.coerce.number().min(0.01, 'Kiritilgan ma’lumot yaroqli emas!').max(100).optional().nullable(),
    weight: z.coerce.number().min(1).max(100),
  })
  .superRefine((data, ctx) => {
    if (data.calculation_type === 'PENALTY') {
      const v = data.penalty_per_unit
      if (v === undefined || v === null || isNaN(Number(v))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Majburiy maydon!',
          path: ['penalty_per_unit'],
        })
      } else if (Number(v) > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: 100,
          type: 'number',
          inclusive: true,
          message: 'Kiritilgan ma’lumot yaroqli emas!',
          path: ['penalty_per_unit'],
        })
      }
    }
  })

const taskSchema = z.object({
  year: z.coerce.number().min(2020).max(2100),
  quarter: z.coerce.number().min(1).max(4),
  kpi_department_id: z.string().min(1, 'Majburiy maydon!'),
  indicators: z.array(indicatorSchema).min(1, 'Majburiy maydon!'),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface Props {
  isOpen: boolean
  onClose: () => void
  editData?: KpiTaskDetail | null
  defaultYear?: number
  defaultQuarter?: number
}

export function KpiTaskModal({ isOpen, onClose, editData, defaultYear, defaultQuarter }: Props) {
  const isEditing = !!editData
  const { data: departments = [] } = useGetDepartments()
  const createMutation = useCreateKpiTask()
  const updateMutation = useUpdateKpiTask()
  const isPending = createMutation.isPending || updateMutation.isPending

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      year: defaultYear ?? currentYear,
      quarter: defaultQuarter ?? 1,
      kpi_department_id: '',
      indicators: [{ name: '', calculation_type: 'PLAN', target: 0, penalty_per_unit: null, weight: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'indicators',
  })

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        form.reset({
          year: editData.year,
          quarter: editData.quarter,
          kpi_department_id: editData.kpi_department_id,
          indicators: editData.indicators.map((ind: KpiIndicator) => ({
            name: ind.name,
            calculation_type: (ind.calculation_type as CalcType) ?? 'PLAN',
            target: ind.target,
            penalty_per_unit: ind.penalty_per_unit ?? null,
            weight: ind.weight,
          })),
        })
      } else {
        form.reset({
          year: defaultYear ?? currentYear,
          quarter: defaultQuarter ?? 1,
          kpi_department_id: '',
          indicators: [{ name: '', calculation_type: 'PLAN', target: 0, penalty_per_unit: null, weight: 0 }],
        })
      }
    }
  }, [isOpen, editData, defaultYear, defaultQuarter, currentYear, form])

  const indicators = form.watch('indicators')
  const totalWeight = indicators.reduce((sum, ind) => sum + (Number(ind.weight) || 0), 0)
  // Strict equality breaks on fractional weights; the backend uses the same tolerance.
  const isWeightValid = Math.abs(totalWeight - 100) < 0.01

  const onSubmit = (values: TaskFormValues) => {
    if (!isWeightValid) return

    // PLAN indicators must not carry a penalty value
    const cleanedIndicators = values.indicators.map((ind) => ({
      ...ind,
      penalty_per_unit: ind.calculation_type === 'PENALTY' ? ind.penalty_per_unit : null,
    }))

    if (isEditing && editData) {
      updateMutation.mutate({ id: editData.id, data: { indicators: cleanedIndicators } }, { onSuccess: onClose })
    } else {
      createMutation.mutate({ ...values, indicators: cleanedIndicators } as any, { onSuccess: onClose })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {isEditing ? 'KPI Vazifani tahrirlash' : 'Yangi KPI Vazifa yaratish'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Year / Quarter / Department */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Yil</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quarter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Chorak</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4].map((q) => (
                          <SelectItem key={q} value={String(q)}>
                            {q}-chorak
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kpi_department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Bo‘lim</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={isEditing}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bo‘lim tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments
                          .filter((dept: any) => dept.is_active !== false)
                          .map((dept: any) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Indicators */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Indikatorlar</h3>
                <div
                  className={cn(
                    'rounded-full px-3 py-1 text-sm font-semibold',
                    isWeightValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  )}
                >
                  Jami vazn: {totalWeight}% / 100%
                </div>
              </div>

              {!isWeightValid && totalWeight > 0 && (
                <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-sm text-amber-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Barcha indikatorlar vazni yig‘indisi aniq <strong>100%</strong> bo‘lishi shart!
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="grid grid-cols-[2.5fr_1.2fr_0.8fr_1fr_0.7fr_36px] gap-3 border-b px-1 pb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                <span>Indikator nomi</span>
                <span>Hisoblash turi</span>
                <span>Maqsad</span>
                <span className="text-red-500">Har bir jarima %</span>
                <span>Vazn %</span>
                <span />
              </div>

              {fields.map((field, index) => {
                const calcType = form.watch(`indicators.${index}.calculation_type`)
                const isPenalty = calcType === 'PENALTY'

                return (
                  <div
                    key={field.id}
                    className={cn(
                      'grid grid-cols-[2.5fr_1.2fr_0.8fr_1fr_0.7fr_36px] items-start gap-3 rounded-lg border p-2',
                      isPenalty ? 'border-red-100 bg-red-50/40' : 'border-blue-100 bg-blue-50/20'
                    )}
                  >
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name={`indicators.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Indikator nomi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* calculation_type */}
                    <FormField
                      control={form.control}
                      name={`indicators.${index}.calculation_type`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={(val) => {
                              field.onChange(val)
                              if (val === 'PLAN') {
                                form.setValue(`indicators.${index}.penalty_per_unit`, null)
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={cn(
                                  'text-xs font-semibold',
                                  isPenalty
                                    ? 'border-red-300 bg-red-50 text-red-700'
                                    : 'border-blue-300 bg-blue-50 text-blue-700'
                                )}
                              >
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CALC_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* target */}
                    <FormField
                      control={form.control}
                      name={`indicators.${index}.target`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="0" min={0} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* penalty_per_unit */}
                    <FormField
                      control={form.control}
                      name={`indicators.${index}.penalty_per_unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            {isPenalty ? (
                              <Input
                                type="number"
                                placeholder="0 – 100"
                                min={0}
                                max={100}
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                className="border-red-300 bg-white focus-visible:ring-red-400"
                              />
                            ) : (
                              <div className="flex h-9 items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50/60 text-xs text-gray-300">
                                —
                              </div>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* weight */}
                    <FormField
                      control={form.control}
                      name={`indicators.${index}.weight`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" placeholder="0" min={1} max={100} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remove */}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-red-200 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed border-gray-300 text-gray-500 hover:text-gray-700"
                onClick={() =>
                  append({ name: '', calculation_type: 'PLAN', target: 0, penalty_per_unit: null, weight: 0 })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Indikator qo‘shish
              </Button>
            </div>

            {/* Legend */}
            <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 border-t pt-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-full bg-blue-400" />
                <strong className="text-foreground font-medium">{KPI_CALCULATION_TYPE.PLAN.label}</strong> — natija
                rejaga nisbatan foizda hisoblanadi
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-full bg-red-400" />
                <strong className="text-foreground font-medium">{KPI_CALCULATION_TYPE.PENALTY.label}</strong> — har bir
                xatolik uchun belgilangan foiz ayiriladi (ko‘pi bilan 100%)
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending || !isWeightValid}>
                {isPending ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
