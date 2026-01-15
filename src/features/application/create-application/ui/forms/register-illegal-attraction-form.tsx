import { CardForm, RegisterIllegalAttractionDTO } from '@/entities/create-application'
import { AppealFormSkeleton } from '@/features/application/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import DetailRow from '@/shared/components/common/detail-row'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { parseISO } from 'date-fns'
import { useRegisterIllegalAttraction } from '@/features/application/create-application/model/use-create-illegal-attraction-passport-application'

interface RegisterIllegalAttractionFormProps {
  onSubmit: (data: RegisterIllegalAttractionDTO) => void
  isPending?: boolean
}

export default ({ onSubmit, isPending = false }: RegisterIllegalAttractionFormProps) => {
  const {
    form,
    isUpdate,
    attractionNameOptions,
    attractionSortOptions,
    districtOptions,
    regionOptions,
    riskLevelOptions,
    ownerData,
    isLoading,
    isSearchLoading,
    isSubmitPending,
    handleSearch,
    handleClear,
    handleSubmit,
  } = useRegisterIllegalAttraction(onSubmit)

  const identity = form.watch('identity')
  const birthDateString = form.watch('birthDate')
  const isLegal = identity?.length === 9
  const isIndividual = identity?.length === 14

  if (isLoading) {
    return <AppealFormSkeleton />
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
        <GoBack title={isUpdate ? 'Attraksion maʼlumotlarini tahrirlash' : 'Attraksionni ro‘yxatga olish arizasi'} />

        {((isUpdate && isLegal) || !isUpdate) && (
          <CardForm className="my-2">
            {!isUpdate ? (
              <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
                <FormField
                  control={form.control}
                  name="identity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>STIR yoki JSHSHIR</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!!ownerData}
                          className="3xl:w-sm w-full"
                          placeholder="STIR yoki JSHSHIRni kiriting"
                          maxLength={14}
                          {...field}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '')
                            e.target.value = val
                            if (ownerData) handleClear()
                            if (val.length !== 14) {
                              form.setValue('birthDate', undefined as any)
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
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => {
                      const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                      return (
                        <FormItem className="3xl:w-sm w-full">
                          <FormLabel required>Tug‘ilgan sana</FormLabel>
                          <DatePicker
                            disabled={!!ownerData}
                            className="3xl:w-sm w-full"
                            value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                            onChange={field.onChange}
                            placeholder="Sanani tanlang"
                            disableStrategy="after"
                          />
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                )}

                <div className="3xl:w-sm flex w-full items-end justify-start gap-2">
                  {!ownerData ? (
                    <Button
                      type="button"
                      onClick={handleSearch}
                      disabled={isSearchLoading || !identity || (!isLegal && !(isIndividual && birthDateString))}
                      loading={isSearchLoading}
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
            ) : null}

            {ownerData && (
              <div className={`${!isUpdate ? 'mt-4 border-t pt-4' : ''}`}>
                <h3 className="mb-4 text-base font-semibold text-gray-800">
                  {isLegal ? 'Tashkilot maʼlumotlari' : 'Fuqaro maʼlumotlari'}
                </h3>
                <div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-1">
                  <DetailRow
                    title={isLegal ? 'Tashkilot nomi:' : 'F.I.SH.:'}
                    value={isLegal ? ownerData?.name || ownerData?.legalName || '-' : ownerData?.fullName || '-'}
                  />
                  {isLegal && (
                    <>
                      <DetailRow
                        title="Tashkilot rahbari:"
                        value={ownerData?.directorName || ownerData?.fullName || '-'}
                      />
                      <DetailRow title="Manzil:" value={ownerData?.address || ownerData?.legalAddress || '-'} />
                      <DetailRow title="Telefon raqami:" value={ownerData?.phoneNumber || '-'} />
                    </>
                  )}
                </div>
              </div>
            )}
          </CardForm>
        )}

        <CardForm className="mb-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
            {!isUpdate && (
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
            )}
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
            <FormField
              control={form.control}
              name="childEquipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion turi</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                        }
                      }}
                      value={String(field.value || '')}
                    >
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
            <FormField
              control={form.control}
              name="childEquipmentSortId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion tipi</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                        }
                      }}
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
                  <FormLabel required>Attraksionni ishlab chiqaruvchi zavod nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Zavod nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturedAt"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required>Attraksion ishlab chiqarilgan sana</FormLabel>
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
            <FormField
              control={form.control}
              name="acceptedAt"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required>Dastlabki foydalanishga qabul qilingan sana</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      disableStrategy={'after'}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
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
                      disableStrategy={'before'}
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="factoryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion zavod raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Zavod raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion ishlab chiqarilgan mamlakat</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Mamlakat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => {
                        if (v) {
                          field.onChange(v)
                          form.setValue('districtId', 0)
                        }
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
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                        }
                      }}
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
                  <FormLabel required>Geolokatsiya (xaritadan attraksion joylashgan joyni tanlang)</FormLabel>
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
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksionning biomexanik xavf darajasi</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                    >
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

        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-1 2xl:grid-cols-2">
          <div className="border-b pb-4">
            <FormField
              name="labelPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Attraksionning surʼati
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE, FileTypes.PDF]} />
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
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
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

          <div className="border-b pb-4">
            <FormField
              name="technicalJournalPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Kundalik texnik xizmat ko‘rsatish attraksion ishlari boshlanishidan oldin olib boriladi. Natijalar
                      bo‘yicha attraksionlardan xavfsiz foydalanishga javobgar shaxs attraksionni kundalik foydalanishga
                      ruxsat berganligi to‘g‘rida jurnali
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
              name="servicePlanPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Attraksionlarga davriy texnik xizmat ko‘rsatish attraksion egasi yoki attraksionni ijaraga olgan
                      shaxs tomonidan tasdiqlangan reja-jadvali
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
              name="technicalManualPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Texnik shahodat sinovlari attraksiondan foydalanish qo‘llanmasi va mazkur Qoidalar talablariga
                      muvofiq attraksionlarni soz holatda saqlash va xavfsiz foydalanish uchun masʼul bo‘lgan mutaxassis
                      boshchiligida amalga oshiriladi. Masʼul mutaxassis buyrug‘i
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
              name="seasonalInspectionPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Mavsumiy foydalaniladigan attraksionlar to‘liq texnik shahodat sinovlaridan o‘tganligi to‘g‘risida
                      maʼlumotlar
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
                      <FormLabel required>Amal qilish muddati</FormLabel>
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
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Bog‘ attraksionining mavsumga tayyorligi to‘g‘risidagi dalolatnomasi
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
              name="seasonalReadinessActExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel required>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="technicalReadinessActPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                      Attraksionlarning texnik tayyorligi dalolatnomasi (yangi o‘rnatilgan 2023 yil 28 maydan so‘ng
                      muomalaga kiritilgan attraksionlar uchun - majburiy, qolgan attraksionlar uchun - mavjud bo‘lsa)
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
              name="employeeSafetyKnowledgePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Bog‘ xodimlarning mehnatni muhofaza qilish bo‘yicha bilimlarini sinovdan o‘tganligi to‘g‘risida
                      maʼlumot
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
                      <FormLabel required>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
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
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Ruxsatnoma
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
              name="usageRightsExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel required>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="preservationActPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                      Attraksionni saqlashga qo’yish dalolatnomasi
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
              name="cctvInstallationPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Video kuzatuv moslamasi o’rnatilganligi surʼati
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE, FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              name="qrPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                      Attraksionga QR kod axborot taxtachasiga o’rnatilganligi surʼati
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE, FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <Button type="submit" disabled={!ownerData && !isUpdate} loading={isPending || isSubmitPending}>
          {isUpdate ? 'Saqlash' : 'Ariza yaratish'}
        </Button>
      </form>
    </Form>
  )
}
