import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select'
import { useManagerSelect } from '@/features/application/application-detail/hooks/use-manager-select'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useState } from 'react'
import { useAuth } from '@/shared/hooks/use-auth'
import { useAdd } from '@/shared/hooks/api'
import { useQueryClient } from '@tanstack/react-query'
import { UserRoles } from '@/shared/types/user'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

const schema = z.object({
  executorId: z.string({ message: FORM_ERROR_MESSAGES.required }),
})

interface Props {
  changeId: string
}

const AssignExecutorModal = ({ changeId }: Props) => {
  const { user } = useAuth()
  const [isShow, setIsShow] = useState(false)
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useAdd(`/changes/${changeId}/executor`)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const { data: inspectorSelectData } = useInspectorSelect(true, user?.isSupervisor)
  const { data: managerSelectData } = useManagerSelect()

  const isHead = user?.role === UserRoles.HEAD
  const isRegional = user?.role === UserRoles.REGIONAL

  const selectOptions = getSelectOptions(isHead ? managerSelectData || [] : isRegional ? inspectorSelectData || [] : [])

  function onSubmit(data: z.infer<typeof schema>) {
    mutateAsync({
      userId: data.executorId,
    }).then(() => {
      setIsShow(false)
      invalidateEndpoint(queryClient, '/changes/by-belong')
    })
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button> Ijro etish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-blue-400">Ijrochini belgilash</DialogTitle>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AssignExecutorModal
