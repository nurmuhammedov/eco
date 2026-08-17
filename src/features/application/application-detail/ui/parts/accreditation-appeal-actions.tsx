import { ApplicationStatus } from '@/entities/application'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Textarea } from '@/shared/components/ui/textarea'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { ACCREDITATION_SPHERE_OPTIONS } from '@/shared/constants/accreditation-spheres'
import { QK_APPLICATIONS } from '@/shared/constants/query-keys'
import useAdd from '@/shared/hooks/api/useAdd'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const replySchema = z
  .object({
    result: z.enum(['true', 'false'], { required_error: FORM_ERROR_MESSAGES.required }),
    basisPath: z.string({ required_error: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
    conclusion: z.string({ required_error: FORM_ERROR_MESSAGES.required }).trim().min(1, FORM_ERROR_MESSAGES.required),
    spheres: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.result === 'true' && data.spheres.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['spheres'],
        message: 'Kamida bitta akkreditatsiya sohasini tanlang!',
      })
    }
  })

type ReplyFormValues = z.infer<typeof replySchema>

interface AccreditationAppealActionsProps {
  appealId: string
  status?: ApplicationStatus
}

export const AccreditationAppealActions = ({ appealId, status }: AccreditationAppealActionsProps) => {
  const queryClient = useQueryClient()

  const [isProcessOpen, setIsProcessOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [reason, setReason] = useState('')

  const replyForm = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { result: undefined, basisPath: undefined, conclusion: '', spheres: [] },
    mode: 'onChange',
  })

  const isPositive = replyForm.watch('result') === 'true'

  const {
    mutate: process,
    isPending: isProcessing,
    isSuccess: isProcessSuccess,
  } = useAdd<any, any, any>(`/appeals/accreditation/${appealId}/process`, 'Ariza ijroga olindi!')

  const {
    mutate: cancel,
    isPending: isCanceling,
    isSuccess: isCancelSuccess,
  } = useAdd<{ reason: string }, any, any>(`/appeals/accreditation/${appealId}/cancel`, 'Ariza qaytarildi!')

  const {
    mutate: reply,
    isPending: isReplying,
    isSuccess: isReplySuccess,
  } = useAdd<any, any, any>(`/appeals/accreditation/${appealId}/reply`, 'Ariza ijrosi bajarildi!')

  useEffect(() => {
    if (isProcessSuccess || isCancelSuccess || isReplySuccess) {
      setIsProcessOpen(false)
      setIsCancelOpen(false)
      setIsReplyOpen(false)
      setReason('')
      replyForm.reset()
      queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] })
    }
  }, [isProcessSuccess, isCancelSuccess, isReplySuccess])

  const handleReply = (values: ReplyFormValues) => {
    reply({
      basisPath: values.basisPath,
      conclusion: values.conclusion,
      result: values.result === 'true',
      spheres: values.result === 'true' ? values.spheres : [],
    })
  }

  const isNew = status === ApplicationStatus.NEW
  const isInProcess = status === ApplicationStatus.IN_PROCESS

  if (!isNew && !isInProcess) return null

  return (
    <div className="flex gap-2">
      {isNew && (
        <>
          <Button onClick={() => setIsProcessOpen(true)}>Ijroga olish</Button>
          <Button variant="warning" onClick={() => setIsCancelOpen(true)}>
            Qaytarib yuborish
          </Button>
        </>
      )}
      {isInProcess && (
        <Button variant="success" onClick={() => setIsReplyOpen(true)}>
          Ijroni bajarish
        </Button>
      )}

      <Dialog open={isProcessOpen} onOpenChange={setIsProcessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ijroga olish</DialogTitle>
            <DialogDescription>Ushbu arizani ijroga olmoqchimisiz?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsProcessOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={() => process({})} disabled={isProcessing} loading={isProcessing}>
              Ijroga olish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qaytarib yuborish sababini kiriting</DialogTitle>
            <DialogDescription>Ariza arizachiga tahrirlash uchun qaytariladi.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Sababni yozing..." value={reason} onChange={(e) => setReason(e.target.value)} />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="warning"
              onClick={() => cancel({ reason })}
              disabled={isCanceling || !reason.trim()}
              loading={isCanceling}
            >
              Qaytarib yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ariza ijrosini bajarish</DialogTitle>
          </DialogHeader>
          <Form {...replyForm}>
            <form onSubmit={replyForm.handleSubmit(handleReply)} className="flex flex-col gap-4">
              <FormField
                control={replyForm.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Ijro natijasi</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer font-normal">Ijobiy</FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer font-normal">Salbiy</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isPositive && (
                <FormField
                  control={replyForm.control}
                  name="spheres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Akkreditatsiya sohalari</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={ACCREDITATION_SPHERE_OPTIONS}
                          value={field.value}
                          onChange={(vals) => field.onChange(vals as string[])}
                          placeholder="Sohalarni tanlang..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={replyForm.control}
                name="basisPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Ijro asos fayli</FormLabel>
                    <FormControl>
                      <InputFile form={replyForm} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={replyForm.control}
                name="conclusion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Ijro izohi</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Xulosani yozing..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsReplyOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" variant="success" disabled={isReplying} loading={isReplying}>
                  Saqlash
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
