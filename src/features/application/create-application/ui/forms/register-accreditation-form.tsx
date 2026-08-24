import { ApplicationTypeEnum, CardForm, RegisterAccreditationDTO } from '@/entities/create-application'
import { useCreateAccreditationApplication } from '@/features/application/create-application/model/use-create-accreditation-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

import { useParams } from 'react-router-dom'

interface RegisterAccreditationFormProps {
  onSubmit: (data: any) => void
}

const ATTACHMENTS: { name: keyof RegisterAccreditationDTO; label: string }[] = [
  {
    name: 'accreditationScopePath',
    label:
      'Talabgor faoliyat yuritmoqchi bo‘lgan akkreditatsiya sohasi hamda akkreditatsiya sohasi bo‘yicha ishlarni bajarish uchun sanoat xavfsizligi sohasidagi ekspertlar bilan ta’minlangani to‘g‘risida ma’lumotlar',
  },
  {
    name: 'organizationCharterPath',
    label: 'Ekspert tashkiloti Nizomi',
  },
  {
    name: 'complianceDeclarationPath',
    label: 'Talabgorning akkreditatsiya mezonlariga muvofiqligini tavsiflovchi deklaratsiya',
  },
  {
    name: 'expertStaffListPath',
    label:
      'Talabgorning shtatida bo‘lgan sanoat xavfsizligi sohasidagi ekspertlar va xodimlar ro‘yxati, unda ularning egallab turgan lavozimlari, diplom ma’lumoti bo‘yicha mutaxassisligi, ish staji, ekspertiza ishlarida ushbu xodimlar qatnashgan asosiy obyektlari ro‘yxati ko‘rsatiladi',
  },
  {
    name: 'equipmentAndConditionsPath',
    label:
      'Akkreditatsiya sohasidagi ishlarni bajarish uchun mavjud sharoitlar, jihozlar, dasturlar va asbob-uskunalar haqidagi ma’lumotlar hamda ularga egalik yoki boshqa ashyoviy huquqlarni tasdiqlovchi hujjatlar',
  },
  {
    name: 'qmsCertificatePath',
    label: 'Talabgorning sifatni boshqarish tizimining muvofiqlik sertifikati',
  },
  {
    name: 'receiptPath',
    label: 'Davlat xizmatini koʻrsatish uchun yigʻim toʻlangani (toʻlov kvitansiyasi)',
  },
]

const RegisterAccreditationForm = ({ onSubmit }: RegisterAccreditationFormProps) => {
  const { type } = useParams<{ type: ApplicationTypeEnum }>()
  const appealType = type as ApplicationTypeEnum

  const { form, title, regionOptions, activityDistrictOptions } = useCreateAccreditationApplication(appealType)

  const handleSubmit = (dto: RegisterAccreditationDTO) => {
    onSubmit({
      ...dto,
      appealType,
      activityRegionId: Number(dto.activityRegionId),
      activityDistrictId: Number(dto.activityDistrictId),
      email: dto.email || null,
    })
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
        <GoBack title={title} />

        <CardForm className="mt-4 mb-2">
          <div className="3xl:flex 3xl:flex-wrap grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField
              control={form.control}
              name="activityRegionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Faoliyat manzili (viloyat)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                          form.setValue('activityDistrictId', '')
                        }
                      }}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Viloyatni tanlang" />
                      </SelectTrigger>
                      <SelectContent>{regionOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activityDistrictId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Faoliyat manzili (tuman/shahar)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                      disabled={!form.watch('activityRegionId')}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Tumanni tanlang" />
                      </SelectTrigger>
                      <SelectContent>{activityDistrictOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activityAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Faoliyat manzili</FormLabel>
                  <FormControl>
                    <Input
                      className="3xl:w-sm w-full"
                      placeholder="Viloyat va tuman nomisiz, faqat manzil"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Telefon raqami</FormLabel>
                  <FormControl>
                    <PhoneInput className="3xl:w-sm w-full" placeholder="+998 XX XXX XX XX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elektron pochta manzili</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="info@example.uz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <CardForm className="mb-5">
          <h3 className="mb-4 font-medium">Ilovalar</h3>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            {ATTACHMENTS.map((attachment) => (
              <FormField
                key={attachment.name}
                name={attachment.name}
                control={form.control}
                render={({ field }) => (
                  <FormItem className="border-b pb-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <FormLabel className="w-full sm:max-w-1/2 2xl:max-w-3/7" required>
                        {attachment.label}
                      </FormLabel>
                      <FormControl>
                        <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </CardForm>

        <Button type="submit" className="mt-0">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  )
}

export default RegisterAccreditationForm
