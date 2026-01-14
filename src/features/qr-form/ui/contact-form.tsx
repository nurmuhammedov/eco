import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { usePublicEquipmentDetail } from '../hooks/usePublicEquipmentDetail'
import { useSubmitAppeal } from '../hooks/useSubmitAppeal'
import { useUploadFile } from '../hooks/useUploadFile'
import { AppealDto } from '../api/post-appeal'
import { CameraCapture } from './camera-capture'
import { getDate } from '@/shared/utils/date.ts'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { Coordinate } from '@/shared/components/common/yandex-map'
import FileLink from '@/shared/components/common/file-link'

const formSchema = z.object({
  type: z.enum(['APPEAL', 'COMPLAINT', 'SUGGESTION'], {
    required_error: 'Murojaat turini tanlang',
  }),
  fullName: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length <= 4 || USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  message: z.string().min(5, 'Murojaat matni juda qisqa'),
})

type SimpleFormValues = z.infer<typeof formSchema>

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Amaldagi qurilma', className: 'bg-green-100 text-green-700 hover:bg-green-200' },
  INACTIVE: { label: 'Reyestrdan chiqarilgan', className: 'bg-red-100 text-red-700 hover:bg-red-200' },
  EXPIRED: { label: 'Muddati o‘tgan', className: 'bg-red-100 text-red-700 hover:bg-red-200' },
  NO_DATE: { label: 'Muddati kiritilmagan', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  DEFAULT: { label: 'Noma’lum holat', className: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
}

const DetailRow = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
  <div
    className={cn(
      'flex flex-col items-start justify-between gap-1 border-b py-3 last:border-0 sm:flex-row sm:items-center',
      className
    )}
  >
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="text-right text-sm font-medium">{value || '-'}</span>
  </div>
)

const SectionHeader = ({ title }: { title: string }) => (
  <div className="border-b bg-blue-50/50 p-4">
    <h2 className="text-lg font-semibold text-blue-600">{title}</h2>
  </div>
)

export const ContactForm = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = usePublicEquipmentDetail(id)
  const { mutate: submitAppeal, isPending: isSubmitting } = useSubmitAppeal()
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile()

  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<File | null>(null)

  const form = useForm<SimpleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', phoneNumber: '', message: '' },
  })

  const mapCoordinates = useMemo(() => {
    if (!data?.location) return []
    const coords = data.location.split(',')?.map(Number)
    return coords.length === 2 ? [coords] : []
  }, [data?.location])

  const onSubmit = async (values: SimpleFormValues) => {
    if (!data?.id) return

    let uploadedFilePath: string | undefined = undefined

    if (capturedImage) {
      try {
        const res = await uploadFile(capturedImage)
        if (!res?.data) {
          toast.error('Fayl yo‘li serverdan kelmadi')
        }
        uploadedFilePath = res.data
      } catch (error) {
        console.error(error)
        toast.error('Rasmni yuklashda xatolik yuz berdi')
        return
      }
    }

    const payload: AppealDto = {
      ...values,
      type: values.type as unknown as 'APPEAL' | 'COMPLAINT' | 'SUGGESTION',
      belongId: data.id,
      belongType: 'EQUIPMENT',
      filePath: uploadedFilePath,
    }

    submitAppeal(payload, {
      onSuccess: (res) => {
        setSubmittedId(res.message)
        setCapturedImage(null)
        form.reset()
        toast.success('Murojaatingiz muvaffaqiyatli yuborildi!')
        setTimeout(() => setSubmittedId(null), 10000)
      },
      onError: (err) => {
        toast.error(`Xatolik: ${err.message}`)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-muted-foreground mx-auto w-full max-w-4xl p-6 text-center">
        <p>Ushbu ID bo‘yicha qurilma maʼlumotlari topilmadi.</p>
      </div>
    )
  }

  const status = STATUS_MAP[data.status || ''] || STATUS_MAP.DEFAULT
  const isProcessing = isUploading || isSubmitting

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
        <SectionHeader title="Qurilma maʼlumotlari" />
        <div className="p-4 sm:p-6">
          <DetailRow label="Qurilma" value={data.type} />
          <DetailRow label="Qurilma nomi" value={data.attractionName || 'Nomi kiritilmagan'} />
          <DetailRow label="Qurilma turi" value={data.childEquipmentName} />
          <DetailRow label="Qurilma tipi" value={data.childEquipmentSortName} />
          <DetailRow label="Ro‘yxatga olingan raqam" value={data.registryNumber} />
          <DetailRow label="Inspektor" value={data.inspectorName} />
          <DetailRow label="Ro‘yxatga olingan sana" value={getDate(data.registrationDate)} />
          <DetailRow label="Ishlab chiqarilgan sana" value={getDate(data.manufacturedAt)} />
          <DetailRow label="Foydalanishga qabul qilingan" value={getDate(data.acceptedAt)} />
          <DetailRow label="Xizmat muddati" value={getDate(data.servicePeriod)} />
          <DetailRow label="Biomexanik xavf darajasi" value={data.riskLevel} />

          <DetailRow
            label="Holati"
            value={<Badge className={cn('pointer-events-none', status.className)}>{status.label}</Badge>}
          />

          <DetailRow label="Tashkilot nomi" value={data.ownerName} />
          <DetailRow label="Tashkilot STIR" value={data.ownerIdentity} />

          <DetailRow
            label="Sertifikat fayli"
            value={data.registryFilePath ? <FileLink url={data.registryFilePath} title="Yuklab olish" /> : null}
          />
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
        <SectionHeader title="Murojaat yuborish" />

        <div className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="fullName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>F.I.SH. (ixtiyoriy)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ism-sharifingiz" {...field} />
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
                        <PhoneInput placeholder="+998 XX XXX XX XX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-2 space-y-2">
                <FormLabel>Rasm biriktirish (ixtiyoriy)</FormLabel>
                {!capturedImage ? (
                  <CameraCapture onCapture={setCapturedImage} />
                ) : (
                  <div className="bg-muted relative mt-2 w-fit rounded-lg border p-1">
                    <img
                      src={URL.createObjectURL(capturedImage)}
                      alt="Captured"
                      className="h-auto max-h-[200px] w-auto rounded-md object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-sm"
                      onClick={() => setCapturedImage(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
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

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isProcessing} className="w-full min-w-[150px] sm:w-auto">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isUploading ? 'Yuklanmoqda...' : 'Yuborilmoqda...'}
                    </>
                  ) : (
                    'Yuborish'
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {submittedId && (
            <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <span className="text-xl text-green-600">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Murojaat muvaffaqiyatli yuborildi</p>
                  <p className="text-sm text-green-700">
                    Murojaat raqami: <strong className="font-bold">{submittedId}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {mapCoordinates.length > 0 && (
        <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
          <SectionHeader title="Qurilma manzili" />
          <YandexMap
            coords={mapCoordinates as unknown as Coordinate[]}
            center={mapCoordinates[0] as unknown as Coordinate}
            zoom={16}
          />
        </div>
      )}
    </div>
  )
}
