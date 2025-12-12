import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '@/shared/components/ui/textarea.tsx'
import { useState } from 'react'
import { useEIMZO } from '@/shared/hooks/useEIMZO'
import { ApplicationModal } from '@/features/application/create-application'
import { useParams } from 'react-router-dom'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts'

const schema = z.object({
  conclusion: z.string(),
})

const ReferenceCreateModal = () => {
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
  } = useEIMZO({
    pdfEndpoint: '/appeals/reply/generate-pdf',
    submitEndpoint: '/appeals/reply',
    successMessage: 'Muvaffaqiyatli saqlandi!',
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
          <Button> Ijro etish</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Ma’lumotnoma/dalolatnoma tuzish</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="conclusion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ma’lumotnoma / dalolatnoma xulosa qismi</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        rows={7}
                        placeholder="Ma’lumotnoma / dalolatnoma xulosa qismi"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Bekor qilish</Button>
                </DialogClose>
                <Button type="submit">Ma’lumotnoma/dalolatnoma tuzish</Button>
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

export default ReferenceCreateModal
