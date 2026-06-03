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
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { FileLink } from '@/shared/components/common/file-link'
import { getDate } from '@/shared/utils/date'
import { parseISO, format } from 'date-fns'
import { TriangleAlert } from 'lucide-react'
import { Skeleton } from '@/shared/components/ui/skeleton'

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
    profileData,
    hasIncompleteOrgFiles,
    isProfileLoading,
  } = useCreateIrsApplication()
  const isDataNull = !profileData

  const irsOrgFiles = [
    { key: 'file1Path', label: 'Mehnat vazirligi tomonidan berilgan ekspertiza xulosasi' },
    { key: 'file2Path', label: 'Sanitariya-epidemiologik xulosasi' },
    { key: 'file5Path', label: 'Radiatsiyaviy xavfsizlik bo‘yicha o‘qiganlik yuzasidan sertifikat' },
    { key: 'file15Path', label: 'Tibbiy ko‘rikdan o‘tkazilganligi' },
  ]

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit((d) => {
          const rawData = { ...form.getValues(), ...d }
          const cleanedData = Object.fromEntries(
            Object.entries(rawData).map(([key, value]) => {
              if ((value as any) instanceof Date && !isNaN((value as any).getTime()))
                return [key, format(value as any, 'yyyy-MM-dd')]
              return [key, value]
            })
          )
          onSubmit(cleanedData as any)
        })}
      >
        <GoBack title="Ionlashtiruvchi nurlanish manbalarini ro‘yxatga olish" />
        <CardForm className="mt-2 mb-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
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
        <div className="mt-4 mb-2 text-base font-semibold text-slate-800">INM tashkilotiga tegishli fayllar</div>
        {!isDataNull && hasIncompleteOrgFiles && (
          <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
            <TriangleAlert className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              Tashkilotning ayrim hujjatlari mavjud emas. Reyestrlar bo‘limidan tashkilot maʼlumotlarini yangilash
              imkoniyati mavjud. Arizani tashkilot hujjatlari to‘liq mavjud bo‘lganda yuborish mumkin!
            </AlertDescription>
          </Alert>
        )}
        {isProfileLoading ? (
          <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2 border-b pb-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardForm>
        ) : isDataNull ? (
          <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
            <div className="border-b pb-4">
              <FormField
                name="file1Path"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <FormLabel required>Mehnat vazirligi tomonidan berilgan ekspertiza xulosasi</FormLabel>
                      <FormControl>
                        <InputFile
                          form={form}
                          name={field.name}
                          accept={[FileTypes.PDF]}
                          onRemove={() => form.setValue('file1ExpiryDate', undefined as any, { shouldValidate: true })}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file1ExpiryDate"
                render={({ field }) => {
                  const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                  return (
                    <FormItem className="w-full">
                      <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <FormLabel required={!!form.watch('file1Path')}>Amal qilish muddati</FormLabel>
                        <DatePicker
                          disableStrategy="before"
                          className={'w-full sm:max-w-[65%]'}
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Amal qilish muddati"
                          disabled={!form.watch('file1Path')}
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
                name="file2Path"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <FormLabel required>Sanitariya-epidemiologik xulosasi</FormLabel>
                      <FormControl>
                        <InputFile
                          form={form}
                          name={field.name}
                          accept={[FileTypes.PDF]}
                          onRemove={() => form.setValue('file2ExpiryDate', undefined as any, { shouldValidate: true })}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file2ExpiryDate"
                render={({ field }) => {
                  const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                  return (
                    <FormItem className="w-full">
                      <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <FormLabel required={!!form.watch('file2Path')}>Amal qilish muddati</FormLabel>
                        <DatePicker
                          disableStrategy="before"
                          className={'w-full sm:max-w-[65%]'}
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Amal qilish muddati"
                          disabled={!form.watch('file2Path')}
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
                name="file5Path"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <FormLabel required>Radiatsiyaviy xavfsizlik bo‘yicha o‘qiganlik yuzasidan sertifikat</FormLabel>
                      <FormControl>
                        <InputFile
                          form={form}
                          name={field.name}
                          accept={[FileTypes.PDF]}
                          onRemove={() => form.setValue('file5ExpiryDate', undefined as any, { shouldValidate: true })}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file5ExpiryDate"
                render={({ field }) => {
                  const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                  return (
                    <FormItem className="w-full">
                      <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <FormLabel required={!!form.watch('file5Path')}>Amal qilish muddati</FormLabel>
                        <DatePicker
                          disableStrategy="before"
                          className={'w-full sm:max-w-[65%]'}
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Amal qilish muddati"
                          disabled={!form.watch('file5Path')}
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
                name="file15Path"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <FormLabel required>Tibbiy ko‘rikdan o‘tkazilganligi</FormLabel>
                      <FormControl>
                        <InputFile
                          form={form}
                          name={field.name}
                          accept={[FileTypes.PDF]}
                          onRemove={() => form.setValue('file15ExpiryDate', undefined as any, { shouldValidate: true })}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file15ExpiryDate"
                render={({ field }) => {
                  const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                  return (
                    <FormItem className="w-full">
                      <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <FormLabel required={!!form.watch('file15Path')}>Amal qilish muddati</FormLabel>
                        <DatePicker
                          disableStrategy="before"
                          className={'w-full sm:max-w-[65%]'}
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Amal qilish muddati"
                          disabled={!form.watch('file15Path')}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </CardForm>
        ) : (
          <CardForm className="mb-5">
            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
              {irsOrgFiles.map((file) => {
                const fileData = profileData?.files?.[file.key]
                return (
                  <div
                    key={file.key}
                    className="flex flex-col items-start gap-3 border-b border-b-[#E5E7EB] px-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="pr-5 text-sm font-medium text-gray-700 sm:text-base">{file.label}</p>
                    <div className="flex items-center gap-2">
                      {fileData?.path ? (
                        <div className="flex-col">
                          <FileLink url={fileData.path} className="mb-1" />
                          {fileData.expiryDate && (
                            <div className="mr-1 mb-1 text-xs text-nowrap text-gray-400">
                              Amal qilish muddati: {getDate(fileData.expiryDate)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-red-600">Mavjud emas</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardForm>
        )}
        <Button type="submit" className="mt-0" disabled={!isDataNull && hasIncompleteOrgFiles}>
          Ariza yaratish
        </Button>
      </form>
    </Form>
  )
}
