import { useAddChecklist } from '@/features/risk-analysis/hooks/use-add-checklist.ts'
import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form.tsx'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select.tsx'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx'
import { useCheckListSelect } from '@/features/checklists/hooks/use-checklist-select.ts'
import { Button } from '@/shared/components/ui/button.tsx'

const schema = z.object({
  templateId: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
  path: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
})

const RiskAnalysisChecklistForm = () => {
  const { mutateAsync, isPending } = useAddChecklist()
  const { data: templateSelectData } = useCheckListSelect()
  const checklistOptions = getSelectOptions(templateSelectData || [])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: any) => {
    mutateAsync({
      ...data,
      templateId: +data.templateId,
    }).then(() => {
      form.setValue('templateId', '')
      form.setValue('path', '')
    })
  }

  return (
    <div className="mb-4 border-b border-b-neutral-100">
      <h3 className="text-base font-medium">Cheklist qo‘shish</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-4 gap-2 py-2">
          <div>
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Cheklist shakllari" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>{checklistOptions}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="path"
              control={form.control}
              render={({ field }) => (
                <FormControl>
                  <InputFile
                    buttonText={'Cheklist faylini tanlang'}
                    form={form}
                    name={field.name}
                    accept={[FileTypes.PDF]}
                  />
                </FormControl>
              )}
            />
          </div>
          <div>
            <Button disabled={isPending}>Qoshish</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default RiskAnalysisChecklistForm
