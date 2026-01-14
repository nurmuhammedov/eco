import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDate, parseISO } from 'date-fns'
import DatePicker from '@/shared/components/ui/datepicker.tsx'
import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select.tsx'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useMemo, useState } from 'react'
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx'
import { useCategoryTypeSelectQuery } from '@/entities/admin/inspection/category-types/hooks/use-category-type-select-query'
import { useCustomSearchParams } from '@/shared/hooks'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { ApplicationModal } from '@/features/application/create-application'
import { Input } from '@/shared/components/ui/input'
import { apiClient } from '@/shared/api/api-client'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  startDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
  endDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
  inspectorIdList: z.array(z.string()).min(1, FORM_ERROR_MESSAGES.required),
  duration: z.enum(['ONE_DAY', 'TEN_DAYS'], { required_error: FORM_ERROR_MESSAGES.required }),

  checklistDtoList: z.array(
    z.object({
      resultIdForObject: z.string(),
      checklistCategoryIdList: z.array(z.number()).min(1, FORM_ERROR_MESSAGES.required),
      specialCode: z.string().min(1, FORM_ERROR_MESSAGES.required),
    })
  ),
})

const AttachInspectorModal = ({ data = [] }: any) => {
  const [isShow, setIsShow] = useState(false)
  const [isCodeLoading, setIsCodeLoading] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const {
    paramsObject: { inspectionId: id = '' },
  } = useCustomSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      checklistDtoList: data.map((item: any) => ({
        resultIdForObject: item.id,
        checklistCategoryIdList: [],
        specialCode: '',
      })),
      // duration default qiymati olib tashlandi
    },
  })

  const startDate = form.watch('startDate')
  const endDate = form.watch('endDate')
  const duration = form.watch('duration')

  const { data: inspectorSelectData } = useInspectorSelect(isShow)
  const { data: categoryTypes } = useCategoryTypeSelectQuery(undefined, isShow)

  const filteredCategoryTypes = useMemo(() => {
    if (!categoryTypes) return {}

    return data.reduce(
      (acc: any, obj: any) => {
        acc[obj.id] = categoryTypes.filter((ct: any) => ct.type === obj.belongType)
        return acc
      },
      {} as Record<string, any[]>
    )
  }, [categoryTypes, data])

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
    pdfEndpoint: '/inspections/decree/generate-pdf',
    submitEndpoint: '/inspections/decree/one-day',
    queryKey: 'inspections-attach-inspectors',
    successMessage: 'Muvaffaqiyatli saqlandi!',
    onSuccessNavigateTo: `/inspections`,
  })

  // 10 kunlik uchun alohida mutation
  const { mutate: submitTenDays, isPending: isTenDaysLoading } = useMutation({
    mutationFn: () =>
      apiClient.post('/inspections/decree/ten-days', {
        dto: formData,
        filePath: documentUrl,
      }),
    onSuccess: (response: any) => {
      if (response && response.success) {
        handleCloseModal()
        toast.success('Muvaffaqiyatli yuborildi!')
        navigate('/inspections')
        queryClient.invalidateQueries({ queryKey: ['inspections-attach-inspectors'] })
      }
    },
    onError: (e: any) => {
      toast.error(e.message || 'Xatolik yuz berdi!')
    },
  })

  const handleGetCode = async (index: number) => {
    const currentItem = data[index]
    const riskAnalysisId = currentItem?.riskAnalysisId

    if (!riskAnalysisId) {
      toast.error('Risk tahlil ID topilmadi!')
      return
    }

    setIsCodeLoading(true)
    try {
      const response = await apiClient.get<any>(`/integration/ombudsman/${riskAnalysisId}`)
      const code = response.data?.data?.requestDocNumber || ''
      if (!code) {
        toast.error('Ushbu xavf tahlil natijasida tekshiruv yaratilmagan!')
      }
      form.setValue(`checklistDtoList.${index}.specialCode`, code)
    } catch (e) {
      console.error('Kodni olishda xatolik:', e)
      form.setValue(`checklistDtoList.${index}.specialCode`, '')
    } finally {
      setIsCodeLoading(false)
    }
  }

  function onSubmit(values: z.infer<typeof schema>) {
    const data = {
      inspectionId: id,
      startDate: formatDate(values.startDate, 'yyyy-MM-dd'),
      endDate: formatDate(values.endDate, 'yyyy-MM-dd'),
      inspectorIdList: values.inspectorIdList,
      checklistDtoList: values.checklistDtoList,
      duration: values.duration,
    }
    setFormData(data)
    handleCreateApplication(data)

    setIsShow(false)
  }

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button size="sm">Inspektorni(larni) belgilash</Button>
        </DialogTrigger>

        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Inspektorni(larni) belgilash</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="col-span-2 space-y-3">
                      <FormLabel required>Tekshiruv muddati</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                            <FormControl>
                              <RadioGroupItem value="ONE_DAY" />
                            </FormControl>
                            <FormLabel className="font-normal">1 kunlik tekshiruv</FormLabel>
                          </FormItem>
                          <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                            <FormControl>
                              <RadioGroupItem value="TEN_DAYS" />
                            </FormControl>
                            <FormLabel className="font-normal">10 kunlik tekshiruv</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {duration === 'ONE_DAY' && (
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => {
                      const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                      return (
                        <FormItem className="col-span-2">
                          <FormLabel required>Tekshiruv o‘tkaziladigan sana</FormLabel>
                          <DatePicker
                            value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                            onChange={(date) => {
                              field.onChange(date)
                              form.setValue('endDate', date as Date)
                            }}
                            placeholder="Sanani tanlang"
                            disableStrategy="custom"
                            customDisabledFn={(date) => {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              return date < today
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                )}

                {duration === 'TEN_DAYS' && (
                  <>
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                        return (
                          <FormItem>
                            <FormLabel required>Tekshiruv boshlanish sanasi</FormLabel>
                            <DatePicker
                              value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                              onChange={field.onChange}
                              placeholder="Boshlanish sanasini tanlang"
                              disableStrategy="custom"
                              customDisabledFn={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                if (date < today) return true
                                return !!(endDate && date > endDate)
                              }}
                            />
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => {
                        const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                        return (
                          <FormItem>
                            <FormLabel required>Tekshiruv tugash sanasi</FormLabel>
                            <DatePicker
                              value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                              onChange={field.onChange}
                              placeholder="Tugash sanasini tanlang"
                              disableStrategy="custom"
                              customDisabledFn={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                if (date < today) return true
                                return !!(startDate && date < startDate)
                              }}
                            />
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </>
                )}

                {duration && (
                  <FormField
                    control={form.control}
                    name="inspectorIdList"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel required>Inspektor(lar)ni tanlang</FormLabel>
                        <FormControl>
                          <MultiSelect
                            {...field}
                            options={inspectorSelectData || []}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Inspektorlarni tanlang"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="mt-6">
                {form.watch('checklistDtoList').map((block, index) => (
                  <div key={block.resultIdForObject} className="mb-4 rounded-xl border bg-slate-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-700">
                      {data[index].belongName} | {data[index].belongRegistryNumber}
                    </div>

                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name={`checklistDtoList.${index}.checklistCategoryIdList`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Kategoriya tanlang</FormLabel>
                            <FormControl>
                              <MultiSelect
                                {...field}
                                options={(filteredCategoryTypes[data[index].id] || []).map((ct: any) => ({
                                  name: ct.name,
                                  id: ct.id,
                                }))}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Kategoriyalarni tanlang"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end gap-2">
                        <FormField
                          control={form.control}
                          name={`checklistDtoList.${index}.specialCode`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel required>Ombudsman maxsus kodi</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Kod kiriting" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" onClick={() => handleGetCode(index)} loading={isCodeLoading}>
                          Kodni olish
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <DialogClose asChild>
                  <Button disabled={isLoading} variant="outline">
                    Bekor qilish
                  </Button>
                </DialogClose>
                <Button disabled={isLoading} type="submit">
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
        isLoading={isLoading || isTenDaysLoading}
        documentUrl={documentUrl || ''}
        isPdfLoading={isPdfLoading}
        onClose={() => {
          handleCloseModal()
          setIsShow(true)
        }}
        submitApplicationMetaData={submitApplicationMetaData}
        showSignature={duration !== 'TEN_DAYS'}
        customAction={
          duration === 'TEN_DAYS' ? (
            <Button onClick={() => submitTenDays()} loading={isTenDaysLoading} disabled={isTenDaysLoading}>
              <Send className="mr-2 size-4" />
              Imzolash uchun yuborish
            </Button>
          ) : null
        }
      />
    </>
  )
}

export default AttachInspectorModal
