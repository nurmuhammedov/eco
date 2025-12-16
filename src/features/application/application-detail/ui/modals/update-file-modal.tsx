// src/features/application/application-detail/ui/modals/update-file-modal.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'

import { InputFile } from '@/shared/components/common/file-upload'
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
import { Form, FormField, FormItem } from '@/shared/components/ui/form'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys'
import { useUpdateApplicationFile } from '../../hooks/mutations/use-update-file'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'

const schema = z.object({
  filePath: z.string({ required_error: 'Fayl yuklanishi shart!' }).min(1, 'Fayl yuklanishi shart!'),
})

type FormValues = z.infer<typeof schema>

interface UpdateFileModalProps {
  appealId?: string
  fieldName: string
}

export const UpdateFileModal: React.FC<UpdateFileModalProps> = ({ appealId, fieldName }) => {
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()
  const { mutate: updateFile, isPending } = useUpdateApplicationFile()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      filePath: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    if (!appealId) return

    updateFile(
      {
        appealId,
        fieldName,
        filePath: data.filePath,
      },
      {
        onSuccess: async () => {
          form.reset()
          setIsOpen(false)
          await queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] })
        },
      }
    )
  }

  if (!appealId) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-gray-500 hover:text-blue-600">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Faylni yangilash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="filePath"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <InputFile
                    form={form}
                    name={field.name}
                    buttonText="Yangi faylni tanlang"
                    accept={[FileTypes.IMAGE, FileTypes.PDF]}
                  />
                </FormItem>
              )}
            />
            <DialogFooter>
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
