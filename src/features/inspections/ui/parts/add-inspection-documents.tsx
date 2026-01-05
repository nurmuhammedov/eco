import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { Input } from '@/shared/components/ui/input.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { useSetFiles } from '@/features/inspections/hooks/use-set-files.ts'
import { QK_INSPECTION } from '@/shared/constants/query-keys'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  specialCode: z.string({ required_error: 'Majburiy maydon!', message: 'Majburiy maydon!' }).default(''),
})

const AddInspectionDocuments = ({ specialCode = '', resultId = '', disabled = false }: any) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useSetFiles()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      specialCode,
    },
  })

  const onSubmit = (data: any) => {
    mutateAsync({
      ...data,
      resultId: resultId,
    }).then(async () => {
      toast.success('Muvaffaqiyatli saqlandi!')
      await queryClient.invalidateQueries({ queryKey: [QK_INSPECTION] })
    })
  }

  return (
    <Form {...form}>
      <form className="flex items-start gap-2 rounded-lg bg-white p-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="specialCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ombudsman maxsus kodi</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="Ombudsman maxsus kodi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!disabled && (
          <Button className="mt-4.5" disabled={isPending} loading={isPending}>
            Saqlash
          </Button>
        )}
      </form>
    </Form>
  )
}

export default AddInspectionDocuments
