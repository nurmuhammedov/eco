import { CardForm } from '@/entities/create-application'
import { AppealFormSkeleton, NoteForm } from '@/features/application/create-application'
import { GoBack } from '@/shared/components/common'
import DetailRow from '@/shared/components/common/detail-row'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { InputNumber } from '@/shared/components/ui/input-number'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { parseISO } from 'date-fns'
import { useRegisterIllegalIrs } from '@/features/application/create-application/model/use-create-illegal-irs-application'
import { RegisterIllegalIrsDTO } from '@/entities/create-application/schemas/register-illegal-irs.schema'

interface RegisterIllegalIrsFormProps {
  onSubmit: (data: RegisterIllegalIrsDTO) => void
  isPending?: boolean
}

export default ({ onSubmit, isPending = false }: RegisterIllegalIrsFormProps) => {
  const {
    form,
    isUpdate,
    regionOptions,
    districtOptions,
    irsIdentifierTypeOptions,
    irsCategoryOptions,
    irsUsageTypeOptions,
    irsStatusOptions,
    ownerData,
    isLoading,
    isSearchLoading,
    isSubmitPending,
    handleSearch,
    handleClear,
    handleSubmit,
  } = useRegisterIllegalIrs(onSubmit)

  const identity = form.watch('identity')

  if (isLoading) {
    return <AppealFormSkeleton />
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
        <GoBack title={isUpdate ? 'INM maʼlumotlarini tahrirlash' : 'INMni ro‘yxatga olish arizasi'} />
        <NoteForm equipmentName="INM" onlyLatin={true} />

        <CardForm className="my-2">
          {!isUpdate ? (
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
                          const val = e.target.value.replace(/\D/g, '')
                          e.target.value = val
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
                    O‘chirish
                  </Button>
                )}
              </div>
            </div>
          ) : null}

          {ownerData && (
            <div className={`${!isUpdate ? 'mt-4 border-t pt-4' : ''}`}>
              <h3 className="mb-4 text-base font-semibold text-gray-800">Tashkilot maʼlumotlari</h3>
              <div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-1">
                <DetailRow title="Tashkilot nomi:" value={ownerData?.legalName || '-'} />
                <DetailRow title="Tashkilot rahbari:" value={ownerData?.directorName || '-'} />
                <DetailRow title="Manzil:" value={ownerData?.address || ownerData?.legalAddress || '-'} />
                <DetailRow title="Telefon raqami:" value={ownerData?.phoneNumber || '-'} />
              </div>
            </div>
          )}
        </CardForm>

        <CardForm className="mb-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
            {!isUpdate && (
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Ariza beruvchining telefon raqami</FormLabel>
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
              name="parentOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yuqori turuvchi tashkilot (mavjud bo‘lsa)</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Yuqori turuvchi tashkilot" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Masʼul shaxsning F.I.Sh.</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Masʼul shaxsning F.I.Sh." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Masʼul shaxsning lavozimi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Masʼul shaxsning lavozimi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>
                    Masʼul shaxsning radiatsiya xavfsizligi bo‘yicha <br /> tayyorgarlik holati
                  </FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Guvohnoma, sertifikat va h.k." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorEducation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Masʼul shaxsning ma‘lumoti</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Masʼul shaxsning ma‘lumoti" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supervisorPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Masʼul shaxsning telefon raqami</FormLabel>
                  <FormControl>
                    <PhoneInput className="3xl:w-sm w-full" placeholder="+998 XX XXX XX XX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="division"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Bo‘linma nomi (INM bilan ishlovchi)</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Bo‘linma nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identifierType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>INMning identifikatsiya raqami (SRM/NUM)</FormLabel>
                  <FormControl>
                    <Select onValueChange={(val) => val && field.onChange(val)} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Identifikatsiya turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {irsIdentifierTypeOptions.map((option: any) => (
                          <SelectItem key={option.props.value} value={option.props.value}>
                            {option.props.children}
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
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Radionuklid belgisi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Radionuklid belgisi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sphere"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Qo‘llash sohasi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Qo‘llash sohasi" {...field} />
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
                  <FormLabel required>Zavod raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Zavod raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Seriya raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Seriya raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Aktivligi, Bk</FormLabel>
                  <FormControl>
                    <InputNumber
                      className="3xl:w-sm w-full"
                      placeholder="Aktivligi, Bk"
                      {...field}
                      value={field.value?.toString()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>INM turi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="INM turi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>INMlarning kategoriyasi</FormLabel>
                  <FormControl>
                    <Select onValueChange={(val) => val && field.onChange(val)} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {irsCategoryOptions.map((option: any) => (
                          <SelectItem key={option.props.value} value={option.props.value}>
                            {option.props.children}
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Ishlab chiqarilgan mamlakat</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Ishlab chiqarilgan mamlakat" {...field} />
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
              name="acceptedFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kimdan olinganligi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Kimdan olinganligi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acceptedAt"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required>Olingan sana</FormLabel>
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
              name="isValid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>INM holati</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => value && field.onChange(value === 'true')}
                      value={String(field.value)}
                    >
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Holatni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {irsStatusOptions.map((option) => (
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
              name="usageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>INMdan foydalanish maqsadi</FormLabel>
                  <FormControl>
                    <Select onValueChange={(val) => val && field.onChange(val)} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Maqsadni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {irsUsageTypeOptions.map((option: any) => (
                          <SelectItem key={option.props.value} value={option.props.value}>
                            {option.props.children}
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
              name="storageLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Saqlash joyi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Saqlash joyi" {...field} />
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
                  <FormLabel required>Joylashgan viloyat</FormLabel>
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
                  <FormLabel required>Joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => val && field.onChange(val)}
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
                  <FormLabel required>Joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Joylashgan manzil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <FormField
            name="passportPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    INM (qurilma) pasporti va sertifikati fayli
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="additionalFilePath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qo‘shimcha ma‘lumotlar</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </CardForm>

        <Button type="submit" disabled={!ownerData && !isUpdate} loading={isPending || isSubmitPending}>
          {isUpdate ? 'Saqlash' : 'Ariza yaratish'}
        </Button>
      </form>
    </Form>
  )
}
