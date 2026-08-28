import { CardForm } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import DetailRow from '@/shared/components/common/detail-row'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { parseISO } from 'date-fns'
import { HF_HAZARDOUS_SIGN_OPTIONS, HF_LEGAL_TYPE_OPTIONS } from '@/shared/constants/hf-attributes'
import { HfCategoryFilesSection } from './parts/hf-category-files-section'
import { RegisterIllegalHfDTO } from '@/entities/create-application/schemas/register-illegal-hf-shcema'
import { useRegisterIllegalHf } from '@/features/application/create-application/model/use-create-illegal-hf-applicaton'
import { NoteForm } from '@/features/application/create-application'

interface RegisterIllegalHfFormProps {
  onSubmit: (data: RegisterIllegalHfDTO) => void
  isPending?: boolean
}

const RegisterIllegalHfForm = ({ onSubmit, isPending = false }: RegisterIllegalHfFormProps) => {
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
            <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 mb-5 grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
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
                <DetailRow title="Manzil:" value={ownerData?.address || ownerData?.legalAddress || '-'} />
                <DetailRow title="Telefon raqami:" value={ownerData?.phoneNumber || '-'} />
              </div>
            </div>
          )}
        </CardForm>

        <CardForm className="my-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-10/10 mb-5 grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
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
                  {isUpdate && detail?.hfTypeName && !['3.1', '3.2', '3.3'].includes(detail.hfTypeName) && (
                    <FormDescription className="3xl:w-sm w-full wrap-break-word">
                      Eski qiymat: {detail.hfTypeName}
                    </FormDescription>
                  )}
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
            <FormField
              control={form.control}
              name="hazardousSign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={!isUpdate}>Xavflilik belgilari</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Xavflilik belgisini tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {HF_HAZARDOUS_SIGN_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id} className="max-w-xl">
                            <span className="block py-1 leading-snug break-words whitespace-normal">{option.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="legalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={!isUpdate}>Tasarruf etish (egalik qilish) huquqiy shakli</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Huquqiy shaklni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {HF_LEGAL_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cadastreNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={!isUpdate}>Kadastr raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Kadastr raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startedDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem>
                    <FormLabel required={!isUpdate}>Foydalanish boshlangan vaqti</FormLabel>
                    <DatePicker
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

        <CardForm className="mb-5">
          <HfCategoryFilesSection form={form} requireMandatory={!isUpdate} />
        </CardForm>

        <Button type="submit" disabled={!ownerData && !isUpdate} loading={isPending || isSubmitPending}>
          {isUpdate ? 'Saqlash' : 'Ariza yaratish'}
        </Button>
      </form>
    </Form>
  )
}

export default RegisterIllegalHfForm
