import { ApplicationModal } from '@/features/application/create-application'
import { Button } from '@/shared/components/ui/button.tsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { Textarea } from '@/shared/components/ui/textarea.tsx'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts'
import { useEimzo } from '@/shared/hooks/use-eimzo'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

const schema = z.object({
  conclusion: z.string(),
})

const RejectApplicationModal = () => {
  const [isShow, setIsShow] = useState(false)

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
    pdfEndpoint: '/appeals/reply/reject/generate-pdf',
    submitEndpoint: '/appeals/reply/reject',
    successMessage: 'Ariza muvaffaqiyatli qaytarildi!',
    queryKey: QK_APPLICATIONS,
  })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const { id } = useParams()

  function onSubmit(data: z.infer<typeof schema>) {
    handleCreateApplication({ ...data, appealId: id })
    setIsShow(false)
  }

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button variant="destructive">Arizani qaytarish</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Arizani qaytarish</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="conclusion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qaytarish sababi</FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" rows={7} placeholder="Qaytarish sababini kiriting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Bekor qilish</Button>
                </DialogClose>
                <Button variant="destructive" type="submit">
                  Arizani qaytarish
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
        documentUrl={documentUrl!}
        onClose={() => {
          handleCloseModal()
          setIsShow(true)
        }}
        isPdfLoading={isPdfLoading}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  )
}

export default RejectApplicationModal
