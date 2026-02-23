import { CardForm } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import DetailRow from '@/shared/components/common/detail-row'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
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
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { parseISO } from 'date-fns'
import { RegisterIllegalHfDTO } from '@/entities/create-application/schemas/register-illegal-hf-shcema'
import { useRegisterIllegalHf } from '@/features/application/create-application/model/use-create-illegal-hf-applicaton'
import { NoteForm } from '@/features/application/create-application'

interface RegisterIllegalHfFormProps {
  onSubmit: (data: RegisterIllegalHfDTO) => void
  isPending?: boolean
}

export default ({ onSubmit, isPending = false }: RegisterIllegalHfFormProps) => {
  const {
    form,
    spheres,
    regionOptions,
    districtOptions,
    hazardousFacilityTypeOptions,
    ownerData,
    detail,
    isUpdate,
    isSearchLoading,
    isSubmitPending,
    handleSearch,
    handleClear,
    handleSubmit,
  } = useRegisterIllegalHf(onSubmit)

  const identity = form.watch('identity')

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
        <GoBack title={isUpdate ? `XICHO ma\u02bclumotlarini tahrirlash` : `XICHOni ro\u2019yxatga olish`} />
        <NoteForm equipmentName="XICHO" onlyLatin={true} />
        <CardForm className="my-2">
          {!isUpdate && (
            <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="identity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>STIR</FormLabel>
                    <FormControl>
                      <Input
                        disabled={!!ownerData}
                        className="3xl:w-sm w-full"
                        placeholder="STIRni kiriting"
                        maxLength={9}
                        {...field}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, '')
                          if (ownerData) handleClear()
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="3xl:w-sm flex w-full items-end justify-start gap-2">
                {!ownerData ? (
                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearchLoading || !identity || identity.length !== 9}
                    loading={isSearchLoading}
                  >
                    Qidirish
                  </Button>
                ) : (
                  <Button type="button" variant="destructive" onClick={handleClear}>
                    O'chirish
                  </Button>
                )}
              </div>
            </div>
          )}

          {ownerData && (
            <div className={`${!isUpdate ? 'mt-4 border-t pt-4' : ''}`}>
              <h3 className="mb-4 text-base font-semibold text-gray-800">Tashkilot maʼlumotlari</h3>
              <div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-1">
                <DetailRow title="Tashkilot nomi:" value={ownerData?.name || ownerData?.legalName || '-'} />
                <DetailRow title="Tashkilot rahbari:" value={ownerData?.directorName || ownerData?.fullName || '-'} />
                <DetailRow title="Manzil:" value={ownerData?.address || '-'} />
                <DetailRow title="Telefon raqami:" value={ownerData?.phoneNumber || '-'} />
              </div>
            </div>
          )}
        </CardForm>

        <CardForm className="my-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-10/10 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
            <FormField
              control={form.control}
              name="upperOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yuqori tashkilotning nomi (mavjud bo‘lsa)</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Yuqori tashkilotning nomi" {...field} />
                  </FormControl>
                  {isUpdate && detail?.upperOrganization && /[\u0400-\u04FF]/.test(detail.upperOrganization) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
                      Eski qiymat: {detail.upperOrganization}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>XICHO ning nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="XICHO ning nomi" {...field} />
                  </FormControl>
                  {isUpdate && detail?.name && /[\u0400-\u04FF]/.test(detail.name) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
                      Eski qiymat: {detail.name}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isUpdate && (
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Bog‘lanish uchun telefon raqami</FormLabel>
                    <FormControl>
                      <PhoneInput className="3xl:w-sm w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="hfTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>XICHO ning turi</FormLabel>
                  <FormControl>
                    <Select onValueChange={(val) => val && field.onChange(val)} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="XICHO ning turi" />
                      </SelectTrigger>
                      <SelectContent>{hazardousFacilityTypeOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spheres"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel required>Tarmoqlar</FormLabel>
                  <FormControl>
                    <MultiSelect
                      className="3xl:w-sm w-full"
                      {...field}
                      options={spheres}
                      maxDisplayItems={5}
                      placeholder="Tarmoqlar"
                    />
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
                  <FormLabel required>XICHO joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value)
                          form.setValue('districtId', '')
                        }
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="XICHO joylashgan viloyat" />
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
                  <FormLabel required>XICHO joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => val && field.onChange(val)}
                      value={field.value}
                      disabled={!form.watch('regionId')}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="XICHO joylashgan tuman" />
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
                <FormItem className="3xl:w-sm w-full">
                  <FormLabel required>XICHO joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Alisher Navoiy ko‘chasi, 1-uy" {...field} />
                  </FormControl>
                  {isUpdate && detail?.address && /[\u0400-\u04FF]/.test(detail.address) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
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
                  <FormLabel required>Joylashuv</FormLabel>
                  <FormControl>
                    <YandexMapModal
                      initialCoords={field.value ? field.value.split(',').map(Number) : null}
                      onConfirm={(coords) => field.onChange(coords)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="extraArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="3xl:w-sm w-full">
                    XICHO sexlari, uchastkalari va maydonchalari nomi
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="3xl:w-sm w-full"
                      placeholder="XICHO sexlari, uchastkalari va maydonchalari nomi"
                      {...field}
                    />
                  </FormControl>
                  {isUpdate && detail?.extraArea && /[\u0400-\u04FF]/.test(detail.extraArea) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
                      Eski qiymat: {detail.extraArea}
                    </FormDescription>
                  )}
                  <FormMessage />
                  <FormDescription>
                    XICHO sexlari, uchastkalari, maydonchalari va boshqa <br /> ishlab chiqarish obyektlarining nomi
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hazardousSubstance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="3xl:w-sm w-full">
                    Xavfli moddalarning nomi va miqdori
                  </FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Xavfli moddalarning nomi va miqdori" {...field} />
                  </FormControl>
                  {isUpdate && detail?.hazardousSubstance && /[\u0400-\u04FF]/.test(detail.hazardousSubstance) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
                      Eski qiymat: {detail.hazardousSubstance}
                    </FormDescription>
                  )}
                  <FormMessage />
                  <FormDescription>
                    VM ning 2008 yil 10 dekabrdagi 271-son qaroriga muvofiq
                    <br /> xavfli moddalarning nomi va miqdori
                  </FormDescription>
                </FormItem>
              )}
            />

            {isUpdate && (
              <>
                <FormField
                  control={form.control}
                  name="managerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Rahbar xodimlar soni</FormLabel>
                      <FormControl>
                        <Input className="3xl:w-sm w-full" placeholder="Kiriting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="engineerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Muhandis-texnik xodimlar soni</FormLabel>
                      <FormControl>
                        <Input className="3xl:w-sm w-full" placeholder="Kiriting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Oddiy ishchi xodimlar soni</FormLabel>
                      <FormControl>
                        <Input className="3xl:w-sm w-full" placeholder="Kiriting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </CardForm>

        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <div className="border-b pb-4">
            <FormField
              name="identificationCardPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Identifikatsiya varag‘i
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
              name="receiptPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                      XICHOni ro‘yxatga olish uchun to‘lov kvitansiyasi
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
              control={form.control}
              name="insurancePolicyPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sug‘urta polisi</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insurancePolicyExpiryDate"
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
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              control={form.control}
              name="cadastralPassportPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">XICHO kadastr pasporti</FormLabel>
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
              name="projectDocumentationPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Loyiha hujjatlari</FormLabel>
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
              control={form.control}
              name="licensePath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Litsenziya</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseExpiryDate"
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
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              control={form.control}
              name="expertOpinionPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Loyiha ekspertiza xulosasi (LH)</FormLabel>
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
              control={form.control}
              name="appointmentOrderPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Maʼsul xodim tayinlanganligi buyrug‘i</FormLabel>
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
              control={form.control}
              name="permitPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ruxsatnoma</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permitExpiryDate"
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
                  </FormItem>
                )
              }}
            />
          </div>

          <div className="border-b pb-4">
            <FormField
              control={form.control}
              name="industrialSafetyDeclarationPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sanoat xavfsizligi deklaratsiyasi</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
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
