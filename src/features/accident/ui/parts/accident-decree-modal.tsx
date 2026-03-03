import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select'
import { useAuth } from '@/shared/hooks/use-auth'
import useAdd from '@/shared/hooks/api/useAdd'
import React from 'react'

const schema = z.object({
  mainInspectorId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  inspectorIds: z.array(z.string()).min(1, 'Kamida bitta inspektor tanlanishi shart!'),
  accidentDecreePath: z.string({ required_error: 'Hujjat yuklanishi shart!' }).min(1, 'Hujjat yuklanishi shart!'),
})

type FormValues = z.infer<typeof schema>

interface AccidentDecreeModalProps {
  accidentId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const AccidentDecreeModal: React.FC<AccidentDecreeModalProps> = ({
  accidentId,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const { user } = useAuth()
  const { data: inspectors } = useInspectorSelect(true, user?.isSupervisor)
  const addMutation = useAdd<FormValues, any, any>(`/accidents/${accidentId}/decree`)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mainInspectorId: '',
      inspectorIds: [],
      accidentDecreePath: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Ma’lumotlar muvaffaqiyatli saqlandi')
        onOpenChange(false)
        onSuccess?.()
      },
      onError: () => {
        toast.error('Xatolik yuz berdi')
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ijro etish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mainInspectorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Komissiya raisi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Komissiya raisini tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>{getSelectOptions(inspectors || [])}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inspectorIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Komissiya aʼzolari</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={(inspectors || []).map((i: any) => ({ id: i.id, name: i.name }))}
                      value={field.value}
                      onChange={(val) => field.onChange(val as string[])}
                      placeholder="Komissiya aʼzolarini tanlang"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accidentDecreePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Hujjat</FormLabel>
                  <InputFile
                    form={form}
                    name={field.name}
                    uploadEndpoint="/attachments/accident-decrees"
                    accept={[FileTypes.PDF]}
                    buttonText="Fayl yuklash"
                    showPreview
                  />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" loading={addMutation.isPending} className="w-full">
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
