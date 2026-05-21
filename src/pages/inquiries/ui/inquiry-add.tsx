import { ChangeEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { GoBack } from '@/shared/components/common'
import { CardForm } from '@/entities/create-application'
import useAdd from '@/shared/hooks/api/useAdd'
import useData from '@/shared/hooks/api/useData'
import { InputFile } from '@/shared/components/common/file-upload/ui/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import DateTimePicker from '@/shared/components/ui/datetimepicker'
import YandexMapModal from '@/shared/components/common/yandex-map-modal/ui/yandex-map-modal'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'

const formSchema = z.object({
  type: z.enum(['APPEAL', 'COMPLAINT', 'SUGGESTION'], {
    required_error: 'Majburiy maydon!',
  }),
  regionId: z.number({
    required_error: 'Viloyatni tanlang!',
  }),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length <= 4 || USER_PATTERNS.phone.test(val), {
      message: "Kiritilgan ma'lumot yaroqli emas!",
    }),
  cardNumber: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true
        const digits = val.replace(/\s+/g, '').replace(/[^0-9]/g, '')
        return digits.length === 16
      },
      {
        message: "Karta raqami to'liq 16 ta raqamdan iborat bo'lishi kerak!",
      }
    ),
  message: z.string().min(1, 'Majburiy maydon!'),
  location: z.string().min(1, 'Majburiy maydon!'),
  occurredAt: z.date({
    required_error: 'Majburiy maydon!',
  }),
  filePathList: z.array(z.string()).min(1, 'Kamida bitta rasm yuklang!'),
})

type SimpleFormValues = z.infer<typeof formSchema>

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}

const InquiryAddPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const belongId = searchParams.get('belongId')
  const belongType = searchParams.get('belongType')

  const { mutate: submitAppeal, isPending: isSubmitting } = useAdd<any, any, any>(
    '/public/inquiries',
    'Murojaatingiz muvaffaqiyatli qabul qilindi'
  )
  const { data: regions } = useData<any>('/regions/select')

  const form = useForm<SimpleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { phoneNumber: '', message: '', location: '', cardNumber: '', filePathList: [] },
  })

  const handleCardInput = (e: ChangeEvent<HTMLInputElement>) => {
    let formatted = formatCardNumber(e.target.value)
    if (formatted.length > 19) {
      formatted = formatted.slice(0, 19)
    }
    form.setValue('cardNumber', formatted)
  }

  const onSubmit = (values: SimpleFormValues) => {
    const payload = {
      type: values.type,
      phoneNumber: values.phoneNumber || null,
      message: values.message,
      location: values.location,
      occurredAt: values.occurredAt.toISOString(),
      regionId: values.regionId,
      belongId: belongId && belongId !== 'null' ? belongId : undefined,
      belongType: belongType && belongType !== 'null' ? belongType : undefined,
      filePathList: values.filePathList,
      cardNumber: values.cardNumber ? values.cardNumber.replace(/\s+/g, '') : null,
    }

    submitAppeal(payload, {
      onSuccess: () => {
        navigate('/inquiries', { replace: true })
      },
    })
  }

  const isProcessing = isSubmitting

  return (
    <div className="w-full">
      <div className="mb-6">
        <GoBack title="Murojaat yuborish" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardForm>
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Murojaat turi <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="APPEAL">Murojaat</SelectItem>
                          <SelectItem value="COMPLAINT">Shikoyat</SelectItem>
                          <SelectItem value="SUGGESTION">Taklif</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="regionId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hudud <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions?.map((r: any) => (
                            <SelectItem key={r.id} value={r.id.toString()}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="occurredAt"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hodisa sodir bo‘lgan sana <span className="text-destructive">*</span>
                      </FormLabel>
                      <DateTimePicker value={field.value} onChange={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="phoneNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon raqam (ixtiyoriy)</FormLabel>
                      <FormControl>
                        <PhoneInput placeholder="+998 XX XXX XX XX" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hodisa sodir bo‘lgan joy <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <YandexMapModal
                          initialCoords={field.value ? field.value.split(',').map(Number) : null}
                          onConfirm={(coords) => field.onChange(coords)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="cardNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plastik karta raqami (ixtiyoriy)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="#### #### #### ####"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => {
                            handleCardInput(e)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>
                    Rasm biriktirish <span className="text-destructive">*</span>
                  </FormLabel>
                  <InputFile
                    name="filePathList"
                    form={form}
                    multiple={true}
                    maxFiles={5}
                    accept={[FileTypes.IMAGE]}
                    uploadEndpoint="/public/attachments/inquiries"
                  />
                </div>

                <FormField
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>
                        Murojaat matni <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Murojaatingiz mazmunini batafsil yozing..."
                          className="min-h-[120px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardForm>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isProcessing} className="min-w-[150px]">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yuborilmoqda...
                </>
              ) : (
                'Yuborish'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default InquiryAddPage
