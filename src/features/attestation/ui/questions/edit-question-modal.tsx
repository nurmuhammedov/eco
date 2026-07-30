import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateQuestion } from '@/entities/attestation/api/attestation.api'
import { questionSchema } from '@/entities/attestation/model/schema'
import { AttestationDirection, AttestationQuestion, UpdateQuestionPayload } from '@/entities/attestation/model/types'
import { toast } from 'sonner'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { servicesApiClient } from '@/shared/api/services-api-client'

interface EditQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  question: AttestationQuestion | null
}

export const EditQuestionModal: FC<EditQuestionModalProps> = ({ isOpen, onClose, question }) => {
  const queryClient = useQueryClient()
  const form = useForm<UpdateQuestionPayload>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      attestation_direction_id: '',
      employee_type: undefined,
      question_text: '',
      is_active: true,
    },
  })

  useEffect(() => {
    if (question) {
      form.reset({
        attestation_direction_id: question.attestation_direction_id,
        employee_type: question.employee_type,
        question_text: question.question_text,
        is_active: question.is_active,
      })
    }
  }, [question, form])

  const { data: directionsRes, isFetching: isLoadingDirections } = useQuery({
    queryKey: ['directions-list'],
    queryFn: () =>
      servicesApiClient.getWithPagination<AttestationDirection>(SERVICES_API_ENDPOINTS.DIRECTIONS, { size: 100 }),
    enabled: isOpen,
  })

  const directions: AttestationDirection[] = Array.isArray(directionsRes?.data)
    ? directionsRes.data
    : (directionsRes?.data as any)?.content || (directionsRes?.data as any)?.items || []

  const { mutate, isPending } = useMutation({
    mutationFn: updateQuestion,
    onSuccess: () => {
      toast.success('Muvaffaqiyatli yangilandi')
      queryClient.invalidateQueries({ queryKey: ['services', SERVICES_API_ENDPOINTS.QUESTIONS] })
      onClose()
    },
    onError: () => {
      toast.error('Xatolik yuz berdi')
    },
  })

  const onSubmit = (data: UpdateQuestionPayload) => {
    if (!question) return
    mutate({ id: question.id, data })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Savolni tahrirlash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="attestation_direction_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Yo'nalish</FormLabel>
                  <Select disabled={isLoadingDirections} value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Yo'nalishni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {directions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
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
                        <SelectValue placeholder="Turini tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LEADER">LEADER</SelectItem>
                      <SelectItem value="ENGINEER">ENGINEER</SelectItem>
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
                    <Textarea placeholder="Savolni kiriting..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Holati</FormLabel>
                    <div className="text-muted-foreground text-sm">{field.value ? 'Aktiv' : 'Nofaol'}</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending} disabled={isPending}>
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
