// src/features/application/create-application/ui/forms/register-xray-form.tsx
import { CardForm, CreateXrayApplicationDTO } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PhoneInput } from '@/shared/components/ui/phone-input.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { FileLink } from '@/shared/components/common/file-link'
import { getDate } from '@/shared/utils/date'
import { parseISO, format, addYears } from 'date-fns'
import { TriangleAlert } from 'lucide-react'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useCreateXrayApplication } from '../../model/use-create-xray-application'

interface RegisterXrayFormProps {
  onSubmit: (data: CreateXrayApplicationDTO) => void
}

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const startYear = 1900
  const years = []
  for (let i = currentYear; i >= startYear; i--) {
    years.push(i)
  }
  return years
}

const yearOptions = generateYearOptions()

export default ({ onSubmit }: RegisterXrayFormProps) => {
  const {
    form,
    regionOptions,
    districtOptions,
    stateServiceOptions,
    profileData,
    hasIncompleteOrgFiles,
    isProfileLoading,
  } = useCreateXrayApplication()
  const isDataNull = !profileData

  const xrayOrgFiles = [
    { key: 'file5Path', label: 'Radiatsiyaviy xavfsizlik bo‘yicha o‘qiganlik yuzasidan sertifikat' },
    { key: 'file7Path', label: 'Dozimetr protokoli (bayonnomasi)' },
    { key: 'file9Path', label: 'Yerga ulash va ventilatsiya dalolatnomasi' },
  ]

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit((d) => {
          const rawData = { ...form.getValues(), ...d }
          const cleanedData = Object.fromEntries(
            Object.entries(rawData).map(([key, value]) => {
              if (value instanceof Date && !isNaN((value as any).getTime()))
                return [key, format(value as any, 'yyyy-MM-dd')]
              return [key, value]
            })
          )
          onSubmit(cleanedData as any)
        })}
      >
        <GoBack title="Rentgen uskunasini ro‘yxatga olish" />
        <CardForm className="my-2">
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
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>License tizimidagi ruxsatnoma raqami</FormLabel>
                  <FormControl>
                    <Input
                      className="3xl:w-sm w-full"
                      placeholder="License tizimidagi ruxsatnoma raqami"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseRegistryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>License tizimidagi ruxsatnoma reyestri tartib raqami</FormLabel>
                  <FormControl>
                    <Input
                      className="3xl:w-sm w-full"
                      placeholder="License tizimidagi ruxsatnoma reyestri tartib raqami"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Rentgen uskunasining modeli</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Rentgen uskunasining modeli" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required>License tizimi orqali ruxsatnoma berilgan sana</FormLabel>
                    <DatePicker
                      disableStrategy="after"
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={(date) => {
                        field.onChange(date)
                        if (date) {
                          const expiryDate = addYears(date, 3)
                          form.setValue('licenseExpiryDate', expiryDate, { shouldValidate: true })
                          form.setValue('file14ExpiryDate', expiryDate, { shouldValidate: true })
                        } else {
                          form.setValue('licenseExpiryDate', undefined as any, { shouldValidate: true })
                          form.setValue('file14ExpiryDate', undefined as any, { shouldValidate: true })
                        }
                      }}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="licenseExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required>Ruxsatnomaning amal qilish muddati</FormLabel>
                    <DatePicker
                      disableStrategy="before"
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Amal qilish muddati"
                      disabled={true}
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
                  <FormLabel required>Rentgen joylashgan viloyat</FormLabel>
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
                  <FormLabel required>Rentgen joylashgan tuman (shahar)</FormLabel>
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
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Rentgen uskunasining raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Rentgen uskunasining raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturedYear"
              render={({ field }) => {
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required>Rentgen uskunasining ishlab chiqarilgan yili</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Yilni tanlang..." />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="stateService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Davlat xizmatining to‘liq nomi</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>{stateServiceOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>
        <div className="mt-4 mb-2 text-base font-semibold text-slate-800">Rentgen uskunasiga tegishli fayllar</div>
        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <div className="border-b pb-4">
            <FormField
              name="file14Path"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <FormLabel required>Ruxsatnoma</FormLabel>
                    <FormControl>
                      <InputFile
                        form={form}
                        name={field.name}
                        accept={[FileTypes.PDF]}
                        onRemove={() => form.setValue('file14ExpiryDate', undefined as any, { shouldValidate: true })}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file14ExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <FormLabel required={!!form.watch('file14Path')}>Amal qilish muddati</FormLabel>
                      <DatePicker
                        disableStrategy="before"
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        placeholder="Amal qilish muddati"
                        disabled={!form.watch('file14Path')}
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
              name="file8Path"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <FormLabel required>Texnik attestatsiya xulosasi</FormLabel>
                    <FormControl>
                      <InputFile
                        form={form}
                        name={field.name}
                        accept={[FileTypes.PDF]}
                        onRemove={() => form.setValue('file8ExpiryDate', undefined as any, { shouldValidate: true })}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file8ExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <FormLabel required={!!form.watch('file8Path')}>Amal qilish muddati</FormLabel>
                      <DatePicker
                        disableStrategy="before"
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        placeholder="Amal qilish muddati"
                        disabled={!form.watch('file8Path')}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>
        </CardForm>
        <div className="mt-4 mb-2 text-base font-semibold text-slate-800">Rentgen tashkilotiga tegishli fayllar</div>
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
            {[1, 2, 3].map((i) => (
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
                          className={'max-w-2/3'}
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
                name="file7Path"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <FormLabel required>Dozimetr protokoli (bayonnomasi)</FormLabel>
                      <FormControl>
                        <InputFile
                          form={form}
                          name={field.name}
                          accept={[FileTypes.PDF]}
                          onRemove={() => form.setValue('file7ExpiryDate', undefined as any, { shouldValidate: true })}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file7ExpiryDate"
                render={({ field }) => {
                  const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                  return (
                    <FormItem className="w-full">
                      <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <FormLabel required={!!form.watch('file7Path')}>Amal qilish muddati</FormLabel>
                        <DatePicker
                          disableStrategy="before"
                          className={'max-w-2/3'}
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Amal qilish muddati"
                          disabled={!form.watch('file7Path')}
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
                name="file9Path"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <FormLabel required>Yerga ulash va ventilatsiya dalolatnomasi</FormLabel>
                      <FormControl>
                        <InputFile
                          form={form}
                          name={field.name}
                          accept={[FileTypes.PDF]}
                          onRemove={() => form.setValue('file9ExpiryDate', undefined as any, { shouldValidate: true })}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file9ExpiryDate"
                render={({ field }) => {
                  const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                  return (
                    <FormItem className="w-full">
                      <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <FormLabel required={!!form.watch('file9Path')}>Amal qilish muddati</FormLabel>
                        <DatePicker
                          disableStrategy="before"
                          className={'max-w-2/3'}
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Amal qilish muddati"
                          disabled={!form.watch('file9Path')}
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
              {xrayOrgFiles.map((file) => {
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
