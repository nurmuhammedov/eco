import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Hook'lar
import { usePublicEquipmentDetail } from '../hooks/usePublicEquipmentDetail'
import { useSubmitAppeal } from '../hooks/useSubmitAppeal'
import { useUploadFile } from '../hooks/useUploadFile'
import { AppealDto } from '../api/postAppeal'

// UI Komponentlar
import { CameraCapture } from './CameraCapture'
import { getDate } from '@/shared/utils/date.ts'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { Coordinate } from '@/shared/components/common/yandex-map'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

// Zod sxemasi
const formSchema = z.object({
  type: z.string({ required_error: 'Murojaat turini tanlash majburiy' }),
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  message: z.string().min(1, { message: 'Murojaat matnini kiritish majburiy' }),
  file: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024, {
      message: 'Fayl hajmi 5MB dan oshmasligi kerak.',
    }),
})

type SimpleFormValues = z.infer<typeof formSchema>

export const ContactForm = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading: isLoadingEquipment } = usePublicEquipmentDetail(id)
  const { mutate: submitAppeal, isPending: isSubmittingAppeal } = useSubmitAppeal()
  const { mutateAsync: uploadFile, isPending: isUploadingFile } = useUploadFile()

  const [submittedAppealNumber, setSubmittedAppealNumber] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<File | null>(null)

  const form = useForm<SimpleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: '', phoneNumber: '', message: '' },
  })

  const onSubmit = async (values: SimpleFormValues) => {
    if (!id || !data) return

    let uploadedFilePath: string | undefined = undefined

    // `fileToUpload` ni aniqlash bloki olib tashlandi, logikani soddalashtiramiz
    if (capturedImage) {
      // Birinchi navbatda kameradan olingan rasmni tekshiramiz
      try {
        const uploadResponse = await uploadFile(capturedImage)
        if (uploadResponse && uploadResponse.data) {
          uploadedFilePath = uploadResponse.data
        } else {
          throw new Error("Rasm yuklandi, lekin serverdan fayl yo'li kelmadi.")
        }
      } catch (error) {
        alert('Rasmni yuklashda xatolik yuz berdi.')
        return
      }
    }
    // Agar kameradan rasm olinmagan bo'lsa, fayl inputini tekshiramiz
    else if (values.file && values.file.length > 0) {
      try {
        const uploadResponse = await uploadFile(values.file[0])
        if (uploadResponse && uploadResponse.data) {
          uploadedFilePath = uploadResponse.data
        } else {
          throw new Error("Fayl yuklandi, lekin serverdan fayl yo'li kelmadi.")
        }
      } catch (error) {
        alert('Faylni yuklashda xatolik yuz berdi.')
        return
      }
    }

    // Asosiy DTO'ni tayyorlaymiz
    const appealDto: AppealDto = {
      type: values.type as 'APPEAL' | 'COMPLAINT' | 'SUGGESTION',
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      message: values.message,
      belongId: data.id,
      belongType: 'EQUIPMENT',
      filePath: uploadedFilePath,
    }

    // Asosiy murojaatni yuboramiz
    submitAppeal(appealDto, {
      onSuccess: (response) => {
        if (response && response.message) {
          setSubmittedAppealNumber(response.message)
          setCapturedImage(null)
          form.reset()
          setTimeout(() => setSubmittedAppealNumber(null), 10000)
        }
      },
      onError: (error) => {
        alert(`Murojaat yuborishda xatolik: ${error.message}`)
      },
    })
  }

  if (isLoadingEquipment) {
    return (
      <div className="mx-auto w-full max-w-4xl p-6 text-center">
        <p>Yuklanmoqda...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-4xl p-6 text-center">
        <p>Ushbu ID bo‘yicha qurilma maʼlumotlari topilmadi.</p>
      </div>
    )
  }

  const currentObjLocation = data.location?.split(',') || ([] as Coordinate[])
  const getStatusInfo = (statusKey?: string) => {
    switch (statusKey) {
      case 'ACTIVE':
        return { text: 'Amaldagi qurilma', classes: 'bg-green-100 text-green-800' }
      case 'INACTIVE':
        return { text: 'Reyestrdan chiqarilgan qurilma', classes: 'bg-red-100 text-red-800' }
      case 'EXPIRED':
        return { text: "Muddati o'tgan qurilma", classes: 'bg-red-100 text-red-800' }
      case 'NO_DATE':
        return { text: 'Muddati kiritilmagan', classes: 'bg-yellow-100 text-yellow-800' }
      default:
        return { text: "Noma'lum holat", classes: 'bg-gray-100 text-gray-800' }
    }
  }
  const statusInfo = getStatusInfo(data.status)
  const infoRowStyles =
    'flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 px-4 border-b border-border last:border-b-0'
  const infoLabelStyles = 'text-sm text-muted-foreground mb-1 sm:mb-0'
  const infoValueStyles = 'text-sm font-medium text-foreground text-left sm:text-right'

  const isProcessing = isUploadingFile || isSubmittingAppeal

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="bg-card text-card-foreground overflow-hidden rounded-lg border shadow-md">
        <div className="bg-[var(--color-blue-200)] p-4">
          <h2 className="text-lg font-semibold text-[var(--color-blue-400)]">Qurilma maʼlumotlari</h2>
        </div>
        <div className="p-2">
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Qurilma</span>
            <span className={infoValueStyles}>{data.type || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Qurilma nomi</span>
            <span className={infoValueStyles}>{data.attractionName || 'Nomi kiritilmagan'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Qurilma turi</span>
            <span className={infoValueStyles}>{data.childEquipmentName || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Qurilma tipi</span>
            <span className={infoValueStyles}>{data.childEquipmentSortName || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Ro'yxatga olingan raqam</span>
            <span className={infoValueStyles}>{data.registryNumber || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Ro'yhatga olgan inspektor</span>
            <span className={infoValueStyles}>{data.inspectorName || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Ro'yhatga olgan sana</span>
            <span className={infoValueStyles}>{getDate(data.registrationDate) || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Ishlab chiqarilgan sana</span>
            <span className={infoValueStyles}>{getDate(data.manufacturedAt) || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Dastlabki foydalanishga qabul qilingan sana</span>
            <span className={infoValueStyles}>{getDate(data.acceptedAt) || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Qurilma xizmat muddati</span>
            <span className={infoValueStyles}>{getDate(data.servicePeriod) || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Biomexanik xavf darajasi</span>
            <span className={infoValueStyles}>{data.riskLevel || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Holati</span>
            <span className={`${infoValueStyles} rounded-full px-2 py-1 text-xs font-medium ${statusInfo.classes}`}>
              {statusInfo.text}
            </span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Tashkilot nomi:</span>
            <span className={infoValueStyles}>{data.ownerName || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Tashkilot INN:</span>
            <span className={infoValueStyles}>{data.ownerIdentity || '-'}</span>
          </div>
          <div className={infoRowStyles}>
            <span className={infoLabelStyles}>Sertifikat fayli</span>
            <span className={infoValueStyles}>
              {data.registryFilePath ? (
                <a
                  href={`${import.meta.env.VITE_API_URL}${data.registryFilePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-4 py-2 text-sm transition-colors"
                >
                  Yuklab olish
                </a>
              ) : (
                '-'
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground w-full overflow-hidden rounded-lg border shadow-md">
        <div className="bg-[var(--color-blue-200)] p-4">
          <h2 className="text-lg font-semibold text-[var(--color-blue-400)]">Murojaat yuborish</h2>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          <SelectValue placeholder="Murojaat shaklini tanlang" />
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
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>F.I.O. (ixtiyoriy)</FormLabel>
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

              <div className="space-y-2 pt-2">
                <FormLabel>Rasm biriktirish (ixtiyoriy)</FormLabel>
                {!capturedImage && <CameraCapture onCapture={(file) => setCapturedImage(file)} />}
                {capturedImage && (
                  <div className="relative mt-2 w-fit rounded-md border p-2">
                    <img
                      src={URL.createObjectURL(capturedImage)}
                      alt="Olingan rasm"
                      className="rounded-md"
                      style={{ maxWidth: '200px' }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => setCapturedImage(null)}
                    >
                      X
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
                      <Textarea placeholder="Shu yerga yozing..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center pt-2">
                <Button type="submit" disabled={isProcessing}>
                  {isUploadingFile ? 'Rasm yuklanmoqda...' : isSubmittingAppeal ? 'Yuborilmoqda...' : 'YUBORISH'}
                </Button>
              </div>
            </form>
          </Form>

          {submittedAppealNumber && (
            <div className="mt-4 rounded-md border border-green-200 bg-green-100 p-4 text-green-800">
              <p>
                Murojaat yuborildi, sizning murojaat raqamingiz{' '}
                <strong className="font-bold">{submittedAppealNumber}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card text-card-foreground w-full overflow-hidden rounded-lg border shadow-md">
        <div className="bg-[var(--color-blue-200)] p-4">
          <h2 className="text-lg font-semibold text-[var(--color-blue-400)]">Qurilma manzili</h2>
        </div>
        <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
      </div>
    </div>
  )
}
