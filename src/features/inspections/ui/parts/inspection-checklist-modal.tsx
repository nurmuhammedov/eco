import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button.tsx'
import { Checkbox } from '@/shared/components/ui/checkbox.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx'
import { Input } from '@/shared/components/ui/input'
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx'
import { useCustomSearchParams } from '@/shared/hooks'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { ApplicationModal } from '@/features/application/create-application'

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
    violators: z
      .array(
        z.object({
          articleList: z.array(z.string()).default([]),
          fullName: z.string().default(''),
          position: z.string().default(''),
        })
      )
      .default([]),

    users: z
      .array(
        z.object({
          fullName: z.string({ required_error: 'Majburiy maydon' }).min(1, 'Majburiy maydon'),
          position: z.string({ required_error: 'Majburiy maydon' }).min(1, 'Majburiy maydon'),
        })
      )
      .min(1, 'Kamida bitta foydalanuvchi qo‘shilishi kerak'),
  })
  .superRefine((data, ctx) => {
    if (!data.isAdministrativePenalty && !data.isFinancialPenalty) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Kamida bitta chora turini tanlang',
        path: ['isAdministrativePenalty'],
      })
    }

    if (data.isAdministrativePenalty) {
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
      form.reset()
    },
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      isAdministrativePenalty: false,
      isFinancialPenalty: false,
      violators: [
        {
          articleList: [],
          fullName: '',
          position: '',
        },
      ],
      users: [{ fullName: '', position: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'users',
  })

  const {
    fields: violatorFields,
    append: appendViolator,
    remove: removeViolator,
  } = useFieldArray({
    control: form.control,
    name: 'violators',
  })

  const onSubmit = (data: FormValues) => {
    handleCreateApplication({
      dtoList: items,
      resultId,
      type: inspectionType === 'other' ? 'OTHER' : 'RISK_BASED',
      isFinancialPenalty: data.isFinancialPenalty,
      violators: data.isAdministrativePenalty
        ? data.violators.map((v) => ({
            fullName: v.fullName,
            position: v.position,
            penalties: v.articleList,
          }))
        : [],
      participants: data.users,
    })
  }

  return (
    <>
      <Dialog
        onOpenChange={(val) => {
          form.reset()
          if (val) {
            addParams({ modal: 'addUsers' })
          } else {
            removeParams('modal')
          }
        }}
        open={modal === 'addUsers'}
      >
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Maʼlumotlarni to‘ldiring</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Ko‘rilgan choralar</h3>

                <div className="flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="isAdministrativePenalty"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ma’muriy tartibda chora ko'rish</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isFinancialPenalty"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Moliyaviy jarima</FormLabel>
                        </div>
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
                      <div key={field.id} className="relative space-y-4 rounded-xl border bg-slate-50 p-4">
                        {violatorFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive absolute top-2 right-2 h-8 w-8"
                            onClick={() => removeViolator(index)}
                          >
                            <span className="text-xl">&times;</span>
                          </Button>
                        )}
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

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`violators.${index}.fullName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Xodimning ismi</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ismini kiriting..." {...field} />
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
                        + Qo'shish
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Qatnashuvchilar</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name={`users.${index}.fullName`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel required>Ismi</FormLabel>
                          <FormControl>
                            <Input placeholder="Ismini kiriting..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`users.${index}.position`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel required>Lavozimi</FormLabel>
                          <FormControl>
                            <Input placeholder="Lavozimini kiriting..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        O‘chirish
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={() => append({ fullName: '', position: '' })}>
                  + Qatnashuvchi qo‘shish
                </Button>
              </div>
              <div className="flex justify-end gap-2 pt-4">
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
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl || ''}
        isPdfLoading={isPdfLoading}
        onClose={() => {
          handleCloseModal()
        }}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  )
}

export default AttachInspectorModal
