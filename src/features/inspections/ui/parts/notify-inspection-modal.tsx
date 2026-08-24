import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDate, parseISO } from 'date-fns'
import DatePicker from '@/shared/components/ui/datepicker.tsx'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useState } from 'react'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { ApplicationModal } from '@/features/application/create-application'
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts'

const schema = z.object({
  startDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
  endDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
})

const NotifyInspectionModal = ({ inspectionId }: { inspectionId: string }) => {
  const [isShow, setIsShow] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
    },
  })

  const startDate = form.watch('startDate')
  const endDate = form.watch('endDate')

  const {
    error,
    isLoading,
    documentUrl,
    hashCode,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEimzo({
    pdfEndpoint: `/inspections/${inspectionId}/notify/generate-pdf`,
    submitEndpoint: `/inspections/${inspectionId}/notify`,
    queryKey: [QK_INSPECTION, inspectionId],
    successMessage: 'Muvaffaqiyatli xabardor qilindi!',
    onEnd: () => {
      setIsShow(false)
      form.reset()
    },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    handleCreateApplication({
      startDate: formatDate(values.startDate, 'yyyy-MM-dd'),
      endDate: formatDate(values.endDate, 'yyyy-MM-dd'),
    })
  }

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button size="sm">Xabardor qilish</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Xabardor qilish xatini yuborish</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
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
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <DialogClose asChild>
                  <Button disabled={isLoading} variant="outline">
                    Bekor qilish
                  </Button>
                </DialogClose>
                <Button loading={isLoading} type="submit">
                  Shakllantirish
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
        hashCode={hashCode}
        isPdfLoading={isPdfLoading}
        onClose={handleCloseModal}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  )
}

export default NotifyInspectionModal
