import { CardForm, CreateIrsApplicationDTO } from '@/entities/create-application'
import { useCreateIrsApplication } from '@/features/application/create-application/model/use-create-irs-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { InputNumber } from '@/shared/components/ui/input-number'
import { PhoneInput } from '@/shared/components/ui/phone-input.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { parseISO } from 'date-fns'

interface RegisterIrsFormProps {
  onSubmit: (data: CreateIrsApplicationDTO) => void
}

export default ({ onSubmit }: RegisterIrsFormProps) => {
  const {
    form,
    regionOptions,
    districtOptions,
    irsIdentifierTypeOptions,
    irsCategoryOptions,
    irsUsageTypeOptions,
    irsStatusOptions,
  } = useCreateIrsApplication()

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Ionlashtiruvchi nurlanish manbalarini ro‘yxatga olish" />
        <CardForm className="mb-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={(value) => field.onChange(value === 'true')} value={String(field.value)}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                      onValueChange={field.onChange}
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
        <Button type="submit" className="mt-0">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  )
}
