import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx'
import { Input } from '@/shared/components/ui/input'
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx'
import { useCustomSearchParams } from '@/shared/hooks'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { ApplicationModal } from '@/features/application/create-application'
import { Trash2 } from 'lucide-react'

const articleOptions = [
  { id: 'ARTICLE_55', name: 'Oʻzbekiston Respublikasi MJtKning 55-modda' },
  { id: 'ARTICLE_97_FIRST', name: 'Oʻzbekiston Respublikasi MJtKning 97-modda 1-qismi' },
  { id: 'ARTICLE_97_SECOND', name: 'Oʻzbekiston Respublikasi MJtKning 97-modda 2-qismi' },
  { id: 'ARTICLE_97_1_FIRST', name: 'Oʻzbekiston Respublikasi MJtKning 97.1-modda 1-qismi' },
  { id: 'ARTICLE_97_1_SECOND', name: 'Oʻzbekiston Respublikasi MJtKning 97.1-modda 2-qismi' },
  { id: 'ARTICLE_98_FIRST', name: 'Oʻzbekiston Respublikasi MJtKning 98-modda 1-qismi' },
  { id: 'ARTICLE_98_SECOND', name: 'Oʻzbekiston Respublikasi MJtKning 98-modda 2-qismi' },
]

const schema = z.object({
  violators: z
    .array(
      z.object({
        fullName: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
        position: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
        penalties: z
          .array(z.string({ required_error: 'Majburiy maydon!' }), { required_error: 'Majburiy maydon!' })
          .min(1, 'Majburiy maydon!'),
      })
    )
    .min(1, 'Majburiy maydon!'),

  users: z
    .array(
      z.object({
        fullName: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
        position: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
      })
    )
    .min(1, 'Majburiy maydon!'),
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
      violators: [{ fullName: '', position: '', penalties: [] }],
      users: [{ fullName: '', position: '' }],
    },
  })

  const {
    fields: violatorFields,
    append: appendViolator,
    remove: removeViolator,
  } = useFieldArray({
    control: form.control,
    name: 'violators',
  })

  const {
    fields: userFields,
    append: appendUser,
    remove: removeUser,
  } = useFieldArray({
    control: form.control,
    name: 'users',
  })

  const onSubmit = (data: FormValues) => {
    handleCreateApplication({
      dtoList: items,
      resultId,
      type: inspectionType == 'other' ? `OTHER` : 'RISK_BASED',
      violators: data.violators,
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
            <DialogTitle className="text-[#4E75FF]">Maʼlumotlarni to'ldiring</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Qoidabuzarliklar */}
              <div className="space-y-4">
                <h3 className="font-semibold">Ko'rilgan choralar</h3>
                {violatorFields.map((vField, vIndex) => (
                  <div key={vField.id} className="space-y-3 rounded-xl border bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Qoidabuzarlik #{vIndex + 1}</span>
                      {violatorFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => removeViolator(vIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`violators.${vIndex}.penalties`}
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
                        name={`violators.${vIndex}.fullName`}
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
                        name={`violators.${vIndex}.position`}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendViolator({ fullName: '', position: '', penalties: [] })}
                >
                  + Qoidabuzarlik qo‘shish
                </Button>
              </div>

              {/* Qatnashuvchilar */}
              <div className="space-y-3">
                <h3 className="font-semibold">Qatnashuvchilar</h3>
                {userFields.map((field, index) => (
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
                    {userFields.length > 1 && (
                      <Button type="button" variant="destructive" onClick={() => removeUser(index)}>
                        O'chirish
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={() => appendUser({ fullName: '', position: '' })}>
                  + Qatnashuvchi qo'shish
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
