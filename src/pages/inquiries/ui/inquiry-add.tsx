import { useState } from 'react'
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
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import DateTimePicker from '@/shared/components/ui/datetimepicker'
import YandexMapModal from '@/shared/components/common/yandex-map-modal/ui/yandex-map-modal'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'

const formSchema = z.object({
  type: z.enum(['APPEAL', 'VIOLATION_REPORT', 'SUGGESTION'], {
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
      message: 'Kiritilgan maʼlumot yaroqli emas!',
    }),

  message: z.string().min(1, 'Majburiy maydon!'),
  location: z.string().min(1, 'Majburiy maydon!'),
  occurredAt: z.date({
    required_error: 'Majburiy maydon!',
  }),
  filePathList: z.array(z.string()).min(1, 'Kamida bitta rasm yuklang!'),
})

type SimpleFormValues = z.infer<typeof formSchema>

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

  const [success, setSuccess] = useState(false)
  const [registryNumber, setRegistryNumber] = useState<string>('')

  const form = useForm<SimpleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { phoneNumber: '', message: '', location: '', filePathList: [] },
  })

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
    }

    submitAppeal(payload, {
      onSuccess: (res: any) => {
        setSuccess(true)
        setRegistryNumber(res?.message || res?.data?.message || '')
      },
    })
  }

  const isProcessing = isSubmitting

  if (success) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl text-green-600">✓</span>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-green-800">Murojaat qabul qilindi</h2>
          {registryNumber && (
            <div className="mt-4 mb-6 rounded-lg border border-green-200 bg-green-100 p-4">
              <p className="text-sm text-green-800">Murojaat raqami:</p>
              <p className="text-2xl font-bold tracking-wider text-green-900">{registryNumber}</p>
            </div>
          )}
          <Button className="mt-4 w-full" onClick={() => navigate(-1)}>
            Mening murojaatlarim
          </Button>
        </div>
      </div>
    )
  }

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
                          <SelectItem value="VIOLATION_REPORT">Huquqbuzarliik xabari</SelectItem>
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

                <div className="space-y-2">
                  <FormLabel>
                    Xavf aniqlangan obyekt bo‘yicha rasm yoki video <span className="text-destructive">*</span>
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
