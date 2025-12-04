import { CardForm, RegisterIllegalAttractionApplicationDTO } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { formatDate, parseISO } from 'date-fns'
import { useCreateIllegalAttractionPassportApplication } from '@/features/application/create-application/model/use-create-illegal-attraction-passport-application.ts'
import DetailRow from '@/shared/components/common/detail-row'
import { useState } from 'react'
import useAdd from '@/shared/hooks/api/useAdd'

interface RegisterIllegalAttractionPassportFormProps {
  onSubmit: (data: RegisterIllegalAttractionApplicationDTO) => void
}

export default ({ onSubmit }: RegisterIllegalAttractionPassportFormProps) => {
  const { form, regionOptions, districtOptions, attractionNameOptions, attractionSortOptions, riskLevelOptions } =
    useCreateIllegalAttractionPassportApplication()

  const [data, setData] = useState<any>(undefined)

  const identity = form.watch('identity')
  const birthDateString = form.watch('birthDate')

  const cleanIdentity = identity?.trim() || ''
  const isLegal = cleanIdentity.length === 9
  const isIndividual = cleanIdentity.length === 14

  const { mutateAsync: legalMutateAsync, isPending: isLegalPending } = useAdd<any, any, any>('/integration/iip/legal')

  const { mutateAsync: individualMutateAsync, isPending: isIndividualPending } = useAdd<any, any, any>(
    '/integration/iip/individual'
  )

  const handleSearch = () => {
    if (isLegal && !form.formState.errors.identity) {
      legalMutateAsync({ tin: cleanIdentity })
        .then((res) => setData(res.data))
        .catch(() => setData(undefined))
    } else if (isIndividual && birthDateString && !form.formState.errors.birthDate && !form.formState.errors.identity) {
      individualMutateAsync({
        pin: cleanIdentity,
        birthDate: formatDate(birthDateString || new Date(), 'yyyy-MM-dd'),
      })
        .then((res) => setData(res.data))
        .catch(() => setData(undefined))
    } else {
      form.trigger(['identity', 'birthDate']).then((r) => console.log(r))
    }
  }

  const handleClear = () => {
    setData(undefined)
    form.setValue('identity', '')
    form.setValue('birthDate', undefined as unknown as any)
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Attraksion ro‘yxatga olish" />

        <CardForm className="my-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
            <FormField
              control={form.control}
              name="identity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>STIR yoki JSHSHIR</FormLabel>
                  <FormControl>
                    <Input
                      className={'3xl:w-sm w-full'}
                      placeholder="STIR yoki JSHSHIRni kiriting"
                      disabled={!!data}
                      maxLength={14}
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        e.target.value = val
                        if (data) setData(undefined)
                        if (val.length !== 14) {
                          form.setValue('birthDate', undefined as unknown as any)
                        }
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isIndividual && (
              <div>
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                    return (
                      <FormItem className="3xl:w-sm w-full">
                        <FormLabel>Tug‘ilgan sana</FormLabel>
                        <DatePicker
                          disabled={!!data}
                          className="3xl:w-sm w-full"
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Sanani tanlang"
                        />
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>
            )}

            <div className="3xl:w-sm flex w-full items-end justify-start gap-2">
              {!data ? (
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={
                    isLegalPending ||
                    isIndividualPending ||
                    !cleanIdentity ||
                    (!isLegal && !(isIndividual && birthDateString))
                  }
                  loading={isLegalPending || isIndividualPending}
                >
                  Qidirish
                </Button>
              ) : (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  O‘chirish
                </Button>
              )}
            </div>
          </div>

          {data && (
            <div className="mt-6 border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                {isLegal ? 'Tashkilot maʼlumotlari' : 'Fuqaro maʼlumotlari'}
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-1">
                <DetailRow
                  title={isLegal ? 'Tashkilot nomi:' : 'F.I.SH:'}
                  value={data?.name || data?.fullName || '-'}
                />
                {isLegal && <DetailRow title="Tashkilot rahbari F.I.SH:" value={data?.directorName || '-'} />}
                {isLegal && <DetailRow title="Manzil:" value={data?.address || data?.legalAddress || '-'} />}
                {isLegal && <DetailRow title="Telefon raqami:" value={data?.phoneNumber || '-'} />}
              </div>
            </div>
          )}
        </CardForm>

        <CardForm className="my-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
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
            {/* Attraksion nomi */}
            <FormField
              control={form.control}
              name="attractionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Attraksion nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Attraksion turi */}
            <FormField
              control={form.control}
              name="childEquipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion turi</FormLabel>
                  <FormControl>
                    <Select onValueChange={(val) => field.onChange(val)} value={String(field.value || '')}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Attraksion turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{attractionNameOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Attraksion tipi */}
            <FormField
              control={form.control}
              name="childEquipmentSortId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion tipi</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(val)}
                      value={String(field.value || '')}
                      disabled={!form.watch('childEquipmentId')}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Attraksion tipini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{attractionSortOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="factory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attraksionni ishlab chiqaruvchi zavod nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Zavod nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ishlab chiqarilgan sana */}
            <FormField
              control={form.control}
              name="manufacturedAt"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel>Attraksion ishlab chiqarilgan sana</FormLabel>
                    <DatePicker
                      disableStrategy={'after'}
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            {/* Dastlabki foydalanishga qabul qilingan sana */}
            <FormField
              control={form.control}
              name="acceptedAt"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel>Dastlabki foydalanishga qabul qilingan sana</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            {/* Xizmat muddati */}
            <FormField
              control={form.control}
              name="servicePeriod"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required>Xizmat muddati</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            {/* Attraksion zavod raqami */}
            <FormField
              control={form.control}
              name="factoryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attraksion zavod raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Zavod raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Ishlab chiqarilgan mamlakat */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attraksion ishlab chiqarilgan mamlakat</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Mamlakat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Viloyat va Tuman */}
            <FormField
              control={form.control}
              name="regionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v)
                        form.setValue('districtId', 0)
                      }}
                      value={String(field.value || '')}
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
              name="districtId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => field.onChange(v)}
                      value={String(field.value || '')}
                      disabled={!form.watch('regionId')}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Tumanni tanlang" />
                      </SelectTrigger>
                      <SelectContent>{districtOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Manzil va Geolokatsiya */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Aniq manzil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="3xl:w-sm w-full">
                  <FormLabel required>
                    Geolokatsiya (xaritadan attraksion joylashgan joyni tanlang va koordinatalarini kiriting)
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
            {/* Biomechanik xavf darajasi (toifa) */}
            <FormField
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Attraksionning biomexanik xavf darajasi</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Xavf darajasini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{riskLevelOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        {/* Fayl yuklash maydonlari */}
        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <div className="border-b pb-4">
            <FormField
              name="labelPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>Attraksionning surati</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="passportPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>
                      Attraksion ishlab chiqaruvchisi tomonidan va (yoki) ixtisoslashtirilgan tashkilot tomonidan
                      tayyorlangan attraksion pasporti
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="conformityCertPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>
                      Muvofiqlik sertifikati yoki muvofiqlik to‘g‘risidagi deklaratsiyaning nusxasi (2023 yil 28 maydan
                      so‘ng muomalaga kiritilgan attraksionlar uchun - majburiy, qolgan attraksionlar uchun - mavjud
                      bo‘lsa)
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="technicalJournalPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className={'mb-2'}>
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel>
                    Kundalik texnik xizmat ko‘rsatish attraksion ishlari boshlanishidan oldin olib boriladi. Natijalar
                    bo‘yicha attraksionlardan xavfsiz foydalanishga javobgar shaxs attraksionni kundalik foydalanishga
                    ruxsat berganligi to‘g‘risida jurnali.
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <div className="border-b pb-4">
            <FormField
              name="seasonalInspectionPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>
                      Mavsumiy foydalaniladigan attraksionlar to‘liq texnik shahodat sinovlaridan o‘tganligi to‘g‘risida
                      ma’lumotlar.
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seasonalInspectionExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="seasonalReadinessActPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>Bog‘ attraksionining mavsumga tayyorligi to‘g‘risidagi dalolatnomasi.</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seasonalReadinessActExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="servicePlanPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>
                      Attraksionlarga davriy texnik xizmat ko‘rsatish attraksion egasi yoki attraksionni ijaraga olgan
                      shaxs tomonidan tasdiqlangan reja-jadvali.
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="servicePlanExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="technicalManualPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>
                      Texnik shahodat sinovlari attraksiondan foydalanish qo‘llanmasi va mazkur Qoidalar talablariga
                      muvofiq attraksionlarni soz holatda saqlash va xavfsiz foydalanish uchun mas’ul bo‘lgan mutaxassis
                      boshchiligida amalga oshiriladi. Mas’ul mutaxassis buyrug‘i
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technicalManualExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="employeeSafetyKnowledgePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>
                      Bog‘ xodimlarning mehnatni muhofaza qilish bo‘yicha bilimlarini sinovdan o‘tganligi to‘g‘risida
                      ma’lumot.
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeSafetyKnowledgeExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="usageRightsPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>Ruxsatnoma</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usageRightsExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <FormField
            name="technicalReadinessActPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel>
                    Attraksionlarning texnik tayyorligi dalolatnomasi ( yangi o‘rnatilgan 2023 yil 28 maydan so‘ng
                    muomalaga kiritilgan attraksionlar uchun - majburiy, qolgan attraksionlar uchun - mavjud bo‘lsa)
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <div className="border-b pb-4">
            <FormField
              name="preservationActPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel>Attraksionni saqlashga qo’yish dalolatnomasi</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preservationActExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <FormField
            name="cctvInstallationPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel>Attraksionga video kuzatuv moslamasi o’rnatilganligi surati</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="qrPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel>Attraksionga QR kod axborot taxtachasiga o’rnatilganligi surati</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </CardForm>

        <Button type="submit" className="mt-5" disabled={!data}>
          Ariza yaratish
        </Button>
      </form>
    </Form>
  )
}
