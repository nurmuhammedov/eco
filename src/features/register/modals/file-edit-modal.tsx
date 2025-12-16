import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import DatePicker from '@/shared/components/ui/datepicker'
import { QK_REGISTRY } from '@/shared/constants/query-keys'
import { useUpdateRegisterFile } from '../hooks/use-file-edit'

const schema = z.object({
  documentNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  documentDate: z.date({ required_error: 'Majburiy maydon!' }),
  expiryDate: z.date({ required_error: 'Majburiy maydon!' }),
})

type FormType = z.infer<typeof schema>

interface DocumentFormModalProps {
  fieldName: string
  url?: string
}

const DocumentFormModal = ({ fieldName, url }: DocumentFormModalProps) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: updateFile, isPending } = useUpdateRegisterFile(url)

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormType) => {
    updateFile(
      {
        fileName: fieldName,
        fileDto: {
          number: data.documentNumber,
          uploadDate: format(data.documentDate, 'yyyy-MM-dd'),
          expiryDate: format(data.expiryDate, 'yyyy-MM-dd'),
        },
      },
      {
        onSuccess: async () => {
          form.reset()
          setOpen(false)
          await queryClient.invalidateQueries({ queryKey: [QK_REGISTRY] })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Hujjat ma'lumotlarini o'zgartirish"
          className="size-9 shrink-0 text-gray-500 hover:text-blue-600"
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hujjat ma’lumotlari</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Hujjat raqami</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: 123-ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Hujjat sanasi</FormLabel>
                  <DatePicker
                    value={typeof field.value === 'string' ? parseISO(field.value) : field.value}
                    disableStrategy="after"
                    onChange={field.onChange}
                    placeholder="Sanani tanlang"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Amal qilish muddati</FormLabel>
                  <DatePicker
                    disableStrategy="before"
                    value={typeof field.value === 'string' ? parseISO(field.value) : field.value}
                    onChange={field.onChange}
                    placeholder="Muddatni tanlang"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} loading={isPending}>
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentFormModal
