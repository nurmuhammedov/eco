import { useCallback, useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button.tsx'
import { Checkbox } from '@/shared/components/ui/checkbox.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx'
import { Input } from '@/shared/components/ui/input'
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx'
import { useCustomSearchParams } from '@/shared/hooks'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import {
  ActParticipant,
  areAllParticipantsSigned,
  getSignaturesKey,
  toParticipantsPayload,
} from '@/features/inspections/model/act-participants'
import { InspectionActModal } from './inspection-act-modal'

const articleOptions = [
  { id: 'ARTICLE_55', name: 'O‘zbekiston Respublikasi MJtKning 55-modda' },
  { id: 'ARTICLE_97_FIRST', name: 'O‘zbekiston Respublikasi MJtKning 97-modda 1-qismi' },
  { id: 'ARTICLE_97_SECOND', name: 'O‘zbekiston Respublikasi MJtKning 97-modda 2-qismi' },
  { id: 'ARTICLE_97_1_FIRST', name: 'O‘zbekiston Respublikasi MJtKning 97.1-modda 1-qismi' },
  { id: 'ARTICLE_97_1_SECOND', name: 'O‘zbekiston Respublikasi MJtKning 97.1-modda 2-qismi' },
  { id: 'ARTICLE_98_FIRST', name: 'O‘zbekiston Respublikasi MJtKning 98-modda 1-qismi' },
  { id: 'ARTICLE_98_SECOND', name: 'O‘zbekiston Respublikasi MJtKning 98-modda 2-qismi' },
]

const schema = z
  .object({
    isAdministrativePenalty: z.boolean().default(false),
    isFinancialPenalty: z.boolean().default(false),
    noViolation: z.boolean().default(false),
    violators: z
      .array(
        z.object({
          articleList: z.array(z.string()).default([]),
          fullName: z.string().trim().default(''),
          position: z.string().trim().default(''),
        })
      )
      .default([]),

    users: z
      .array(
        z.object({
          fullName: z.string({ required_error: 'Majburiy maydon' }).trim().min(1, 'Majburiy maydon'),
          position: z.string({ required_error: 'Majburiy maydon' }).trim().min(1, 'Majburiy maydon'),
        })
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (!data.isAdministrativePenalty && !data.isFinancialPenalty && !data.noViolation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Kamida bitta variantni tanlang',
        path: ['isAdministrativePenalty'],
      })
    }

    if (data.isAdministrativePenalty) {
      if (data.users.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Kamida bitta qatnashuvchi qo‘shilishi kerak',
          path: ['users'],
        })
      }

      if (data.violators.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Kamida bitta qoidabuzar qo‘shilishi kerak',
          path: ['violators'],
        })
      }
      data.violators.forEach((violator, index) => {
        if (!violator.articleList || violator.articleList.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Kamida bitta modda tanlang',
            path: ['violators', index, 'articleList'],
          })
        }
        if (!violator.fullName || violator.fullName.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Majburiy maydon',
            path: ['violators', index, 'fullName'],
          })
        }
        if (!violator.position || violator.position.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Majburiy maydon',
            path: ['violators', index, 'position'],
          })
        }
      })
    }
  })

type FormValues = z.infer<typeof schema>

const AttachInspectorModal = ({ items = [], resultId }: any) => {
  const {
    addParams,
    removeParams,
    paramsObject: { modal = '', inspectionType = 'RISK_BASED' },
  } = useCustomSearchParams()

  const [participants, setParticipants] = useState<ActParticipant[]>([])
  const [basePayload, setBasePayload] = useState<Record<string, unknown> | null>(null)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const requestedKeyRef = useRef<string | null>(null)

  const resetActState = useCallback(() => {
    setParticipants([])
    setBasePayload(null)
    setGeneratedKey(null)
    requestedKeyRef.current = null
  }, [])

  const {
    error,
    isLoading,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEimzo({
    pdfEndpoint: `/inspection-results/act/generate-pdf`,
    submitEndpoint: '/inspection-results/act',
    queryKey: '/inspection-results',
    successMessage: 'Muvaffaqiyatli saqlandi!',
    onEnd: () => {
      removeParams('modal')
      resetActState()
      form.reset()
    },
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      isAdministrativePenalty: false,
      isFinancialPenalty: false,
      noViolation: false,
      violators: [
        {
          articleList: [],
          fullName: '',
          position: '',
        },
      ],
      users: [],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'users',
  })

  const changeMeasure = useCallback(
    (patch: Partial<Pick<FormValues, 'isAdministrativePenalty' | 'isFinancialPenalty' | 'noViolation'>>) => {
      const next = {
        isAdministrativePenalty: form.getValues('isAdministrativePenalty'),
        isFinancialPenalty: form.getValues('isFinancialPenalty'),
        noViolation: form.getValues('noViolation'),
        ...patch,
      }

      if (patch.noViolation) {
        next.isAdministrativePenalty = false
        next.isFinancialPenalty = false
      }
      if (patch.isAdministrativePenalty || patch.isFinancialPenalty) {
        next.noViolation = false
      }

      form.setValue('isAdministrativePenalty', next.isAdministrativePenalty, { shouldDirty: true })
      form.setValue('isFinancialPenalty', next.isFinancialPenalty, { shouldDirty: true })
      form.setValue('noViolation', next.noViolation, { shouldDirty: true })

      const current = form.getValues('users')
      const filled = current.filter((user) => user.fullName.trim() !== '' || user.position.trim() !== '')

      if (next.isAdministrativePenalty && filled.length === 0) {
        replace([{ fullName: '', position: '' }])
      } else if (filled.length !== current.length) {
        replace(filled)
      }

      if (form.formState.isSubmitted) void form.trigger()
    },
    [form, replace]
  )

  const {
    fields: violatorFields,
    append: appendViolator,
    remove: removeViolator,
  } = useFieldArray({
    control: form.control,
    name: 'violators',
  })

  const noViolation = form.watch('noViolation')
  const usersError = form.formState.errors.users
  const usersMessage = usersError?.message ?? usersError?.root?.message

  const onSubmit = (data: FormValues) => {
    const nextParticipants: ActParticipant[] = data.users.map((user) => ({
      fullName: user.fullName,
      position: user.position,
      signBase64: null,
    }))

    const payload: Record<string, unknown> = {
      dtoList: items,
      resultId,
      type: inspectionType === 'other' ? 'OTHER' : 'RISK_BASED',
    }

    if (!data.noViolation) {
      payload.isFinancialPenalty = data.isFinancialPenalty
      payload.violators = data.isAdministrativePenalty
        ? data.violators.map((violator) => ({
            fullName: violator.fullName,
            position: violator.position,
            penalties: violator.articleList,
          }))
        : []
    }

    const key = getSignaturesKey(nextParticipants)
    requestedKeyRef.current = key
    setGeneratedKey(key)
    setParticipants(nextParticipants)
    setBasePayload(payload)

    handleCreateApplication({ ...payload, participants: toParticipantsPayload(nextParticipants) })
  }

  const handleSignatureChange = useCallback((index: number, signBase64: string) => {
    setParticipants((current) =>
      current.map((participant, currentIndex) =>
        currentIndex === index ? { ...participant, signBase64 } : participant
      )
    )
  }, [])

  useEffect(() => {
    if (!basePayload || !areAllParticipantsSigned(participants)) return

    const key = getSignaturesKey(participants)
    if (requestedKeyRef.current === key) return

    requestedKeyRef.current = key
    setGeneratedKey(key)
    handleCreateApplication({ ...basePayload, participants: toParticipantsPayload(participants) })
  }, [basePayload, participants, handleCreateApplication])

  return (
    <>
      <Dialog
        onOpenChange={(val) => {
          form.reset()
          resetActState()
          if (val) {
            addParams({ modal: 'addUsers' })
          } else {
            removeParams('modal')
          }
        }}
        open={modal === 'addUsers'}
      >
        <DialogContent size="xl" className="flex flex-col gap-0 overflow-hidden rounded-xl! p-0">
          <DialogHeader className="shrink-0 border-b px-4 py-4 sm:px-6">
            <DialogTitle className="pr-8 text-[#4E75FF]">Maʼlumotlarni to‘ldiring</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4 sm:px-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Ko‘rilgan choralar</h3>

                  <div className="flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="isAdministrativePenalty"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              id="measure-administrative"
                              checked={field.value}
                              disabled={noViolation}
                              onCheckedChange={(checked) =>
                                changeMeasure({ isAdministrativePenalty: checked === true })
                              }
                            />
                          </FormControl>
                          <FormLabel htmlFor="measure-administrative" className="cursor-pointer">
                            Ma’muriy tartibda chora ko‘rish
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isFinancialPenalty"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              id="measure-financial"
                              checked={field.value}
                              disabled={noViolation}
                              onCheckedChange={(checked) => changeMeasure({ isFinancialPenalty: checked === true })}
                            />
                          </FormControl>
                          <FormLabel htmlFor="measure-financial" className="cursor-pointer">
                            Moliyaviy jarima
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="noViolation"
                      render={({ field }) => (
                        <FormItem className="mt-1 flex flex-row items-center space-y-0 space-x-3 border-t pt-3">
                          <FormControl>
                            <Checkbox
                              id="measure-none"
                              checked={field.value}
                              onCheckedChange={(checked) => changeMeasure({ noViolation: checked === true })}
                            />
                          </FormControl>
                          <FormLabel htmlFor="measure-none" className="cursor-pointer">
                            Huquqbuzarlik aniqlanmadi
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {form.formState.errors.isAdministrativePenalty && (
                      <p className="text-destructive text-sm font-medium">
                        {form.formState.errors.isAdministrativePenalty.message}
                      </p>
                    )}
                  </div>

                  {form.watch('isAdministrativePenalty') && (
                    <div className="space-y-4 pt-2">
                      {violatorFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-slate-300"
                        >
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="flex size-6 items-center justify-center rounded-full bg-[#DCE4FF] text-xs font-semibold text-[#4E75FF]">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-slate-700">Huquqbuzar</span>
                            </div>
                            {violatorFields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`${index + 1}-huquqbuzarni o‘chirish`}
                                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-8"
                                onClick={() => removeViolator(index)}
                              >
                                <Trash2 />
                              </Button>
                            )}
                          </div>
                          <FormField
                            control={form.control}
                            name={`violators.${index}.articleList`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Moddani tanlang</FormLabel>
                                <FormControl>
                                  <MultiSelect
                                    {...field}
                                    options={articleOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Moddalarni tanlang"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`violators.${index}.fullName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel required>Xodim F.I.SH.</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="F.I.SH. kiriting..."
                                      {...field}
                                      onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`violators.${index}.position`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel required>Xodimning lavozimi</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Lavozimini kiriting..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-start">
                        <Button
                          type="button"
                          onClick={() => appendViolator({ articleList: [], fullName: '', position: '' })}
                        >
                          + Qo‘shish
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">
                    Qatnashuvchilar{' '}
                    <span className="text-muted-foreground font-normal">
                      (shakllantirgan inspektor va tashkilot rahbaridan tashqari)
                    </span>
                  </h3>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-slate-300"
                    >
                      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex size-6 items-center justify-center rounded-full bg-[#DCE4FF] text-xs font-semibold text-[#4E75FF]">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-700">Qatnashuvchi</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`${index + 1}-qatnashuvchini o‘chirish`}
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-8"
                          onClick={() => remove(index)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`users.${index}.fullName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Qatnashuvchi F.I.SH.</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="F.I.SH. kiriting..."
                                  {...field}
                                  onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`users.${index}.position`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Qatnashuvchi lavozimi</FormLabel>
                              <FormControl>
                                <Input placeholder="Lavozimini kiriting..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  {fields.length === 0 ? (
                    <div
                      className={cn(
                        'rounded-xl border border-dashed p-4 text-center text-sm',
                        usersMessage ? 'border-destructive text-destructive' : 'text-muted-foreground border-slate-300'
                      )}
                    >
                      {usersMessage ?? 'Hozircha qatnashuvchi qo‘shilmagan'}
                    </div>
                  ) : (
                    usersMessage && <p className="text-destructive text-sm font-medium">{usersMessage}</p>
                  )}
                  <Button type="button" onClick={() => append({ fullName: '', position: '' })}>
                    + Qatnashuvchi qo‘shish
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    removeParams('modal')
                  }}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Saqlash
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <InspectionActModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl || ''}
        isPdfLoading={isPdfLoading}
        participants={participants}
        onSignatureChange={handleSignatureChange}
        isFinalPdfReady={generatedKey === getSignaturesKey(participants)}
        onClose={() => {
          handleCloseModal()
        }}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  )
}

export default AttachInspectorModal
