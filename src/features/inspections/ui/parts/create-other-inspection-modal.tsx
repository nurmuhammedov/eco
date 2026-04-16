import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDate } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import DatePicker from '@/shared/components/ui/datepicker'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'

import { useEimzo } from '@/shared/hooks/use-eimzo'
import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select'
import { useCategoryTypeSelectQuery } from '@/entities/admin/inspection/category-types/hooks/use-category-type-select-query'
import { useHazardousFacilitySelectQuery } from '@/features/inspections/hooks/use-hf-select-query'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { ApplicationModal } from '@/features/application/create-application'

const schema = z.object({
  startDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
  endDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
  noticeType: z.enum(['NOTIFIED', 'AFTER_24_HOURS'], { required_error: FORM_ERROR_MESSAGES.required }),
  tin: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .regex(/^\d+$/, { message: 'Faqat raqamlar kiritilishi kerak' })
    .refine((val) => val.length === 9 || val.length === 14, {
      message: 'STIR (JSHSHIR) faqat 9 yoki 14 xonali bo‘lishi kerak',
    }),
  hfId: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
  inspectorIdList: z.array(z.string()).min(1, FORM_ERROR_MESSAGES.required),
  checklistCategoryIdList: z.array(z.number()).min(1, FORM_ERROR_MESSAGES.required),
  basisPathList: z.array(z.string()).min(1, FORM_ERROR_MESSAGES.required),
  programPath: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
})

type FormValues = z.infer<typeof schema>

export const CreateOtherInspectionModal = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      inspectorIdList: [],
      checklistCategoryIdList: [],
      basisPathList: [],
      noticeType: 'NOTIFIED',
      tin: '',
    },
  })

  const [searchTin, setSearchTin] = useState('')
  const tinValue = form.watch('tin')
  const { data: hfOptions, isLoading: isHfLoading } = useHazardousFacilitySelectQuery(searchTin, isOpen)

  console.log(hfOptions)
  useEffect(() => {
    form.setValue('hfId', '')
    setSearchTin('') // UI refinement: if STIR changes, search result is also cleared from hook state
  }, [tinValue, form])

  const handleSearchHf = () => {
    if (tinValue.length === 9 || tinValue.length === 14) {
      setSearchTin(tinValue)
    } else {
      toast.error('STIR (JSHSHIR) noto‘g‘ri kiritilgan')
    }
  }
  const { data: inspectorOptions } = useInspectorSelect(isOpen)
  const { data: categoryOptions } = useCategoryTypeSelectQuery(undefined, isOpen)

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
    pdfEndpoint: '/inspections/decree/other/generate-pdf',
    submitEndpoint: '/inspections/decree/other',
    queryKey: 'inspections-other-list',
    successMessage: t('success_saved'),
    onEnd: () => {
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ['/inspections/other'] })
      queryClient.invalidateQueries({ queryKey: ['/inspections/count'] })
    },
  })

  const onSubmit = (values: FormValues) => {
    const payload = {
      startDate: formatDate(values.startDate, 'yyyy-MM-dd'),
      endDate: formatDate(values.endDate, 'yyyy-MM-dd'),
      noticeType: values.noticeType,
      hfId: values.hfId,
      inspectorIdList: values.inspectorIdList,
      checklistCategoryIdList: values.checklistCategoryIdList,
      basisPathList: values.basisPathList,
      programPath: values.programPath,
    }
    handleCreateApplication(payload)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('inspections.other.create_btn')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">{t('inspections.other.create_modal.title')}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-4 rounded-lg border bg-blue-50/30 p-4">
                <FormField
                  control={form.control}
                  name="tin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Tashkilot STIR</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="STIR kiriting" {...field} maxLength={14} className="bg-white" />
                        </FormControl>
                        <Button type="button" onClick={handleSearchHf} disabled={isHfLoading}>
                          {isHfLoading ? 'Qidirish' : 'Qidirish'}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hfId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>XICHOni tanlang</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue
                              placeholder={
                                isHfLoading
                                  ? t('loading')
                                  : hfOptions && hfOptions.length > 0
                                    ? t('select')
                                    : t('select')
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hfOptions?.map((item: any) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t('inspections.other.create_modal.startDate')}</FormLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('select_date')}
                        disableStrategy="before"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>{t('inspections.other.create_modal.endDate')}</FormLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('select_date')}
                        disableStrategy="before"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="noticeType"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel required className="text-sm font-semibold text-slate-700">
                      {t('inspections.other.create_modal.noticeType')}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-3"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="NOTIFIED" id="r1" />
                          <FormLabel htmlFor="r1" className="cursor-pointer font-normal">
                            {t('inspections.other.types.NOTIFIED')}
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="AFTER_24_HOURS" id="r2" />
                          <FormLabel htmlFor="r2" className="cursor-pointer font-normal">
                            {t('inspections.other.types.AFTER_24_HOURS')}
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inspectorIdList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('inspections.other.create_modal.inspectors')}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={inspectorOptions || []}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('select')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checklistCategoryIdList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Kategoriya tanlang</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={(categoryOptions || []).map((c: any) => ({ id: c.id, name: c.name }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('select')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="basisPathList"
                  render={() => (
                    <FormItem>
                      <FormLabel required>{t('inspections.other.create_modal.basis_documents')}</FormLabel>
                      <FormControl>
                        <InputFile
                          multiple
                          maxFiles={5}
                          uploadEndpoint="/attachments/inspections"
                          form={form}
                          name="basisPathList"
                          accept={[FileTypes.PDF, FileTypes.IMAGE]}
                          buttonText={t('select_file')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="programPath"
                  render={() => (
                    <FormItem>
                      <FormLabel required>{t('inspections.other.create_modal.program_file')}</FormLabel>
                      <FormControl>
                        <InputFile
                          uploadEndpoint="/attachments/inspections"
                          form={form}
                          name="programPath"
                          accept={[FileTypes.PDF]}
                          buttonText={t('select_file')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                  {t('actions.cancel')}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {t('actions.save')}
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
          setIsOpen(true)
        }}
        submitApplicationMetaData={submitApplicationMetaData}
        showSignature={true}
      />
    </>
  )
}
