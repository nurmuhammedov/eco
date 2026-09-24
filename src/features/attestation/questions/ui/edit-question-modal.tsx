import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { updateQuestion } from '@/entities/attestation/api/attestation.api'
import { questionSchema } from '@/entities/attestation/model/schema'
import { DIRECTION_OPTIONS, EMPLOYEE_TYPE_OPTIONS } from '@/entities/attestation/model/labels'
import type { AttestationQuestion, QuestionPayload } from '@/entities/attestation/model/types'

interface EditQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  question: AttestationQuestion | null
}

export const EditQuestionModal: FC<EditQuestionModalProps> = ({ isOpen, onClose, question }) => {
  const queryClient = useQueryClient()

  const form = useForm<QuestionPayload>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      direction: undefined,
      employee_type: undefined,
      question_text: '',
      is_active: true,
    },
  })

  useEffect(() => {
    if (isOpen && question) {
      form.reset({
        direction: question.direction,
        employee_type: question.employee_type,
        question_text: question.question_text,
        is_active: question.is_active,
      })
    }
  }, [isOpen, question, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: QuestionPayload) => updateQuestion({ id: question!.id, data }),
    onSuccess: () => {
      toast.success('Savol yangilandi')
      queryClient.invalidateQueries({ queryKey: ['services', SERVICES_API_ENDPOINTS.QUESTIONS] })
      form.reset()
      onClose()
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Savolni tahrirlash</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-4">
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Yo‘nalish</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Yo‘nalishni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DIRECTION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employee_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Xodim turi</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Xodim turini tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMPLOYEE_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Savol matni</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Savol matnini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <FormLabel>Faol</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
