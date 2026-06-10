import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDate } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import DatePicker from '@/shared/components/ui/datepicker'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'

import { useEimzo } from '@/shared/hooks/use-eimzo'
import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select'
import { useCategoryTypeSelectQuery } from '@/entities/admin/inspection/category-types/hooks/use-category-type-select-query'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { ApplicationModal } from '@/features/application/create-application'

export const CreateInquiryInspectionModal = ({ inquiry }: { inquiry: any }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const schema = useMemo(() => {
    return z.object({
      startDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
      endDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
      inspectorIdList: z.array(z.string()).min(1, FORM_ERROR_MESSAGES.required),
      checklistCategoryIdList: z.array(z.number()).min(1, FORM_ERROR_MESSAGES.required),
      programPath: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
    })
  }, [])

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      inspectorIdList: [],
      checklistCategoryIdList: [],
      programPath: '',
    },
  })

  const { data: inspectorOptions, isFetching: isInspectorsLoading } = useInspectorSelect(isOpen)
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
    pdfEndpoint: `/inquiries/${inquiry?.id}/inspection/generate-pdf`,
    submitEndpoint: `/inquiries/${inquiry?.id}/inspection`,
    queryKey: 'inquiry-inspection',
    successMessage: t('success_saved'),
    onEnd: () => {
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ['/inquiries', inquiry?.id] })
      queryClient.invalidateQueries({ queryKey: ['/inspections/by-inquiry', inquiry?.id] })
    },
  })

  const onSubmit = (values: FormValues) => {
    const payload = {
      startDate: formatDate(values.startDate, 'yyyy-MM-dd'),
      endDate: formatDate(values.endDate, 'yyyy-MM-dd'),
      inspectorIdList: values.inspectorIdList,
      checklistCategoryIdList: values.checklistCategoryIdList,
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
            Tekshiruv yaratish
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Tekshiruv yaratish</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                name="inspectorIdList"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('inspections.other.create_modal.inspectors')}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={inspectorOptions || []}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={isInspectorsLoading ? t('loading') : t('select')}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
