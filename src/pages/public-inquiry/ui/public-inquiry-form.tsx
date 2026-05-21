import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useSubmitAppeal } from '@/features/qr-form/hooks/useSubmitAppeal'
import { AppealDto } from '@/features/qr-form/api/post-appeal'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
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
  fullName: z.string().optional().nullable(),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length <= 4 || USER_PATTERNS.phone.test(val), {
      message: "Kiritilgan ma'lumot yaroqli emas!",
    }),
  message: z.string().min(1, 'Majburiy maydon!'),
  location: z.string().min(1, 'Majburiy maydon!'),
  occurredAt: z.date({
    required_error: 'Majburiy maydon!',
  }),
  filePathList: z.array(z.string()).min(1, 'Kamida bitta rasm yuklang!'),
})

type SimpleFormValues = z.infer<typeof formSchema>

const PublicInquiryForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const belongId = searchParams.get('belongId')
  const belongType = searchParams.get('belongType')

  const { mutate: submitAppeal, isPending: isSubmitting } = useSubmitAppeal()
  const { data: regions } = useQuery<any[]>({
    queryKey: ['public-regions-select'],
    queryFn: async () => {
      const res = await apiClient.get<any>('/public/regions/select')
      return res.data?.data || []
    },
  })

  const [success, setSuccess] = useState(false)

  const form = useForm<SimpleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', phoneNumber: '', message: '', location: '', filePathList: [] },
  })

  const onSubmit = (values: SimpleFormValues) => {
    const payload: AppealDto = {
      type: values.type as any,
      fullName: values.fullName || null,
      phoneNumber: values.phoneNumber || undefined,
      message: values.message,
      location: values.location,
      occurredAt: values.occurredAt.toISOString(),
      regionId: values.regionId,
      belongId: belongId || undefined,
      belongType: belongType || undefined,
      filePathList: values.filePathList,
      cardNumber: null, // Anonimda karta null ketadi
    }

    submitAppeal(payload, {
      onSuccess: () => {
        form.reset()
        setSuccess(true)
        toast.success('Murojaatingiz muvaffaqiyatli qabul qilindi')
      },
      onError: (err) => {
        toast.error(`Xatolik: ${err.message}`)
      },
    })
  }

  const isProcessing = isSubmitting

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl text-green-600">✓</span>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-green-800">Murojaatingiz muvaffaqiyatli qabul qilindi</h2>
          <p className="mb-6 text-green-700">Murojaatingiz tez orada mutaxassislar tomonidan o‘rganib chiqiladi.</p>
          <Button className="w-full" onClick={() => navigate('/public-inquiry-choice')}>
            Orqaga qaytish
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-slate-500 hover:text-slate-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Orqaga
        </Button>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b bg-slate-50/50 p-6">
            <h2 className="text-xl font-semibold text-slate-800">Anonim murojaat yuborish</h2>
            <p className="mt-1 text-sm text-slate-500">Iltimos, hodisa haqida batafsil ma’lumot kiriting</p>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
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
                </div>

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

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    name="fullName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>F.I.SH. (ixtiyoriy)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ism-sharifingiz" {...field} value={field.value || ''} />
                        </FormControl>
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
                </div>

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

                <div className="flex flex-col gap-2 space-y-2">
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
                    <FormItem>
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

                <div className="flex justify-end border-t border-slate-100 pt-4">
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="h-12 w-full min-w-[180px] text-base sm:w-auto"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Yuborilmoqda...
                      </>
                    ) : (
                      'Murojaatni yuborish'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicInquiryForm
