import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Edit2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import { InputCurrency } from '@/shared/components/ui/input-currency'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import {
  useAccountantRecoveredAmount,
  useAccountantPaidReward,
  useAccountantMibStatus,
} from '@/features/inquiries/hooks/use-inquiry-mutations'

const getRecoveredSchema = (maxAmount?: number) =>
  z.object({
    recoveredAmount: z
      .number({ required_error: 'Majburiy maydon!' })
      .min(0, 'Manfiy bo‘lishi mumkin emas')
      .refine((val) => maxAmount === undefined || val <= maxAmount, {
        message: 'Kiritilgan ma’lumot yaroqli emas',
      }),
  })

export const RecoveredAmountModal = ({
  inquiryId,
  defaultValue,
  fineAmount,
}: {
  inquiryId: string
  defaultValue?: number
  fineAmount?: number
}) => {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useAccountantRecoveredAmount()

  const schema = getRecoveredSchema(fineAmount)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { recoveredAmount: defaultValue || undefined },
  })

  const onSubmit = async (values: z.infer<ReturnType<typeof getRecoveredSchema>>) => {
    await mutateAsync({ id: inquiryId, data: { recoveredAmount: values.recoveredAmount } })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-primary h-6 w-6 text-slate-400">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tashkilotdan undirilgan summani kiritish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recoveredAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Summa</FormLabel>
                  <FormControl>
                    <InputCurrency
                      control={form.control}
                      name={field.name}
                      placeholder="Tashkilotdan undirilgan summani kiritish"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const getPaidRewardSchema = (maxAmount?: number) =>
  z.object({
    paidRewardAmount: z
      .number({ required_error: 'Majburiy maydon!' })
      .min(0, 'Manfiy bo‘lishi mumkin emas')
      .refine((val) => maxAmount === undefined || val <= maxAmount, {
        message: 'Kiritilgan ma’lumot yaroqli emas',
      }),
    paymentExecutionFilePath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Fayl yuklang!'),
  })

export const PaidRewardModal = ({
  inquiryId,
  defaultValue,
  defaultFile,
  rewardAmount,
}: {
  inquiryId: string
  defaultValue?: number
  defaultFile?: string
  rewardAmount?: number
}) => {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useAccountantPaidReward()

  const schema = getPaidRewardSchema(rewardAmount)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      paidRewardAmount: defaultValue || undefined,
      paymentExecutionFilePath: defaultFile || '',
    },
  })

  const onSubmit = async (values: z.infer<ReturnType<typeof getPaidRewardSchema>>) => {
    await mutateAsync({
      id: inquiryId,
      data: { paidRewardAmount: values.paidRewardAmount, paymentExecutionFilePath: values.paymentExecutionFilePath },
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-primary h-6 w-6 text-slate-400">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>To‘lab berilgan mukofot puli</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paidRewardAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Summa</FormLabel>
                  <FormControl>
                    <InputCurrency
                      control={form.control}
                      name={field.name}
                      placeholder="To‘lab berilgan mukofot puli"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <InputFile
              name="paymentExecutionFilePath"
              form={form}
              uploadEndpoint="/public/attachments/inquiries"
              accept={[FileTypes.IMAGE, FileTypes.PDF, FileTypes.DOC]}
              multiple={false}
              buttonText="To‘lov hujjati faylini yuklang"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const mibStatusSchema = z.object({
  isMib: z.boolean({ required_error: 'Majburiy maydon!' }),
})

export const MibStatusModal = ({ inquiryId, defaultValue }: { inquiryId: string; defaultValue?: boolean }) => {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useAccountantMibStatus()

  const form = useForm<z.infer<typeof mibStatusSchema>>({
    resolver: zodResolver(mibStatusSchema),
    defaultValues: { isMib: defaultValue !== undefined ? defaultValue : undefined },
  })

  const onSubmit = async (values: z.infer<typeof mibStatusSchema>) => {
    await mutateAsync({ id: inquiryId, data: { isMib: values.isMib } })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-primary h-6 w-6 text-slate-400">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>MIB holati</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isMib"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel required>MIB ga oshirildimi?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(val) => field.onChange(val === 'true')}
                      defaultValue={field.value !== undefined ? String(field.value) : undefined}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="!mt-0 font-normal">Ha</FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="!mt-0 font-normal">Yo‘q</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
