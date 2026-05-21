import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select'
import { useManagerSelect } from '@/features/application/application-detail/hooks/use-manager-select'
import { useSetInspector } from '@/features/inquiries/hooks/use-inquiry-mutations'

const schema = z.object({
  executorId: z.string({ message: FORM_ERROR_MESSAGES.required }),
})

const SetInspectorModal = () => {
  const { user } = useAuth()
  const { id } = useParams()
  const [isShow, setIsShow] = useState(false)
  const { mutateAsync, isPending } = useSetInspector()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  // get inspector/manager options depending on roles
  const { data: inspectorSelectData } = useInspectorSelect(true, user?.isSupervisor)
  const { data: managerSelectData } = useManagerSelect()

  const isManager = user?.role === UserRoles.HEAD
  const isRegional = user?.role === UserRoles.REGIONAL

  const selectOptions = getSelectOptions(
    isManager ? managerSelectData || [] : isRegional ? inspectorSelectData || [] : []
  )

  function onSubmit(data: z.infer<typeof schema>) {
    if (!id) return
    mutateAsync({
      id,
      data: { executorId: data.executorId },
    }).then(() => {
      setIsShow(false)
      form.reset()
    })
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button>Ijro etish</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Ijrochini belgilash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="executorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Ijrochini belgilash</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Ijrochini belgilash" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>{selectOptions}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline" type="button">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit" loading={isPending}>
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default SetInspectorModal
