import { CardForm, RegisterIllegalCraneDTO } from '@/entities/create-application'
import { AppealFormSkeleton, NoteForm } from '@/features/application/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import DetailRow from '@/shared/components/common/detail-row'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { parseISO } from 'date-fns'
import { useRegisterIllegalCrane } from '@/features/application/create-application/model/use-create-illegal-crane-application'
import { Alert, AlertTitle } from '@/shared/components/ui/alert'
import { TriangleAlert } from 'lucide-react'

interface RegisterIllegalCraneFormProps {
  onSubmit: (data: RegisterIllegalCraneDTO) => void
  isPending?: boolean
}

export default ({ onSubmit, isPending = false }: RegisterIllegalCraneFormProps) => {
  const {
    form,
    isUpdate,
    childEquipmentOptions,
    districtOptions,
    regionOptions,
    hazardousFacilitiesOptions,
    ownerData,
    detail,
    isLoading,
    isSearchLoading,
    isSubmitPending,
    handleSearch,
    handleClear,
    handleSubmit,
  } = useRegisterIllegalCrane(onSubmit)

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
        <GoBack title={isUpdate ? 'Kran maʼlumotlarini tahrirlash' : 'Kranni ro‘yxatga olish arizasi'} />
        {isUpdate && (
          <Alert className="mt-2 border-yellow-500/50 bg-yellow-500/15">
            <TriangleAlert className="size-4 text-yellow-600!" />
            <AlertTitle className="text-yellow-700">
              Maʼlumotlar lotinda kiritilsin, agar kirilda yozilgan bo‘lsa, tahrirlash jarayonida avtomatik o‘chirib
              yuboriladi!
            </AlertTitle>
          </Alert>
        )}
        <NoteForm equipmentName="kran" />

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

            {isLegal && (
              <FormField
                control={form.control}
                name="hazardousFacilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>XICHOni tanlang</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger className="3xl:w-sm w-full">
                          <SelectValue placeholder="XICHOni tanlang (ixtiyoriy)" />
                        </SelectTrigger>
                        <SelectContent>{hazardousFacilitiesOptions}</SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="childEquipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kran turini tanlang</FormLabel>
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
                        <SelectValue placeholder="Kran turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{childEquipmentOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="factoryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kranning zavod raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Kranning zavod raqami" {...field} />
                  </FormControl>
                  {isUpdate && detail?.factoryNumber && /[\u0400-\u04FF]/.test(detail.factoryNumber) && (
                    <FormDescription className="3xl:w-sm w-full font-bold wrap-break-word text-red-500">
                      Eski qiymat: {detail.factoryNumber}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="factory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Ishlab chiqargan zavod nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Ishlab chiqargan zavod nomi" {...field} />
                  </FormControl>
                  {isUpdate && detail?.factory && /[\u0400-\u04FF]/.test(detail.factory) && (
                    <FormDescription className="3xl:w-sm w-full font-bold wrap-break-word text-red-500">
                      Eski qiymat: {detail.factory}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Model, marka</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Model, marka" {...field} />
                  </FormControl>
                  {isUpdate && detail?.model && /[\u0400-\u04FF]/.test(detail.model) && (
                    <FormDescription className="3xl:w-sm w-full font-bold wrap-break-word text-red-500">
                      Eski qiymat: {detail.model}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boomLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Strelasining uzunligi (m)</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Strelasining uzunligi" {...field} />
                  </FormControl>
                  {isUpdate &&
                    detail?.parameters?.boomLength &&
                    /[\u0400-\u04FF]/.test(detail.parameters.boomLength) && (
                      <FormDescription className="3xl:w-sm w-full font-bold wrap-break-word text-red-500">
                        Eski qiymat: {detail.parameters.boomLength}
                      </FormDescription>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="liftingCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Yuk koʻtara olish quvvati (tonna)</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Yuk koʻtara olish quvvati" {...field} />
                  </FormControl>
                  {isUpdate &&
                    detail?.parameters?.liftingCapacity &&
                    /[\u0400-\u04FF]/.test(detail.parameters.liftingCapacity) && (
                      <FormDescription className="3xl:w-sm w-full font-bold wrap-break-word text-red-500">
                        Eski qiymat: {detail.parameters.liftingCapacity}
                      </FormDescription>
                    )}
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
                    <FormLabel required>Ishlab chiqarilgan sana</FormLabel>
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
              name="partialCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required={!isUpdate}>Qisman texnik koʻrikdan o‘tkazilgan sana</FormLabel>
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
              name="fullCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required={!isUpdate}>Toʻliq texnik koʻrikdan o‘tkazilgan sana</FormLabel>
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
              name="regionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kran joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                          form.setValue('districtId', '')
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
              name="districtId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kran joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value?.toString()}
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
                  <FormLabel required>Qurilma joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Aniq manzilni kiriting" {...field} />
                  </FormControl>
                  {isUpdate && detail?.address && /[\u0400-\u04FF]/.test(detail.address) && (
                    <FormDescription className="3xl:w-sm w-full font-bold wrap-break-word text-red-500">
                      Eski qiymat: {detail.address}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="3xl:w-sm w-full">
                  <FormLabel required>Joylashuv (Xarita)</FormLabel>
                  <FormControl>
                    <YandexMapModal
                      initialCoords={field.value ? field.value.split(',').map(Number) : null}
                      onConfirm={(coords) => field.onChange(coords)}
                      label="Xaritadan belgilash"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <CardForm className="mb-2 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <div className="border-b pb-4">
            <FormField
              name="labelPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required={!isUpdate} className="max-w-1/2 2xl:max-w-3/7">
                      Kranning birkasi bilan surʼati
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
              name="saleContractPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required={!isUpdate} className="max-w-1/2 2xl:max-w-3/7">
                      Sotib olish-sotish shartnomasi
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
              name="expertisePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ekspertiza loyihasi</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expertiseExpiryDate"
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
              name="installationCertPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Montaj guvohnomasi (avtokrandan tashqari)</FormLabel>
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
              name="assignmentDecreePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required={!isUpdate} className="max-w-1/2 2xl:max-w-3/7">
                      Masʼul shaxs tayinlanganligi to‘g‘risida buyruq
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
              name="equipmentCertPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qurilma sertifikati</FormLabel>
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
              name="passportPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required={!isUpdate} className="max-w-1/2 2xl:max-w-3/7">
                      Kranning pasporti
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
              name="partialCheckPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required={!isUpdate} className="max-w-1/2 2xl:max-w-3/7">
                      Kranning qisman texnik ko‘rikdan o‘tkazilganligi
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
              name="nextPartialCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel required={!isUpdate}>Navbatdagi qisman texnik ko‘rik sanasi</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Sanani tanlang"
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
              name="fullCheckPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required={!isUpdate} className="max-w-1/2 2xl:max-w-3/7">
                      Kranning to‘liq texnik ko‘rikdan o‘tkazilganligi
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
              name="nextFullCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex items-end justify-between gap-2 xl:items-center">
                      <FormLabel required={!isUpdate}>Navbatdagi to‘liq texnik ko‘rik sanasi</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Sanani tanlang"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
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
