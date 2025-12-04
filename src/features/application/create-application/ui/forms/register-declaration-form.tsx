import { CardForm, CreateDeclarationApplicationDTO } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PhoneInput } from '@/shared/components/ui/phone-input.tsx'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { parseISO } from 'date-fns'
import { useCreateDeclarationApplication } from '../../model/use-create-declaration-application'

interface RegisterDeclarationFormProps {
  onSubmit: (data: CreateDeclarationApplicationDTO) => void
}

export default ({ onSubmit }: RegisterDeclarationFormProps) => {
  const { form, regionOptions, districtOptions, hazardousFacilitiesOptions } = useCreateDeclarationApplication()

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Sanoat xavfsizligi deklaratsiyasini ro‘yxatga olish" />
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
            <FormField
              control={form.control}
              name="hfId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>XICHO ni tanlang</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="XICHO ni tanlang (ixtiyoriy)" />
                      </SelectTrigger>
                      <SelectContent>{hazardousFacilitiesOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hfName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>XICHO nomi</FormLabel>
                  <FormControl>
                    <Input disabled className="3xl:w-sm w-full" placeholder="XICHO nomini kiriting" {...field} />
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
                  <FormLabel required>Deklaratsiya qilingan obyektning manzili</FormLabel>
                  <FormControl>
                    <Input disabled className="3xl:w-sm w-full" placeholder="Manzilni kiriting" {...field} />
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
                  <FormLabel required>Deklaratsiya qilingan obyekt joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue('districtId', '')
                      }}
                      value={field.value}
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
                  <FormLabel required>Deklaratsiya qilingan obyekt joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch('regionId')}>
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
              name="information"
              render={({ field }) => (
                <FormItem className="w-full xl:col-span-3">
                  <FormLabel required>Deklaratsiya qilingan obyekt haqida maʼlumot</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" placeholder="Ma'lumotni kiriting..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="producingOrganizationTin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Deklaratsiya ishlab chiqqan tashkilot STIR</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="STIRni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="producingOrganizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Deklaratsiya ishlab chiqqan tashkilot nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Tashkilot nomini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="operatingOrganizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Deklaratsiya qilingan obyektni ishlatayotgan tashkilot nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Tashkilot nomini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expertiseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Deklaratsiya qilingan obyektning ekspertiza raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Ekspertiza raqamini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expertiseDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="3xl:w-sm w-full">
                    <FormLabel required>Deklaratsiya qilingan obyektning ekspertiza sanasi</FormLabel>
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
            <FormField
              control={form.control}
              name="registrationOrganizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Deklaratsiyani roʻyxatga olgan tashkilot nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Tashkilot nomini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hfRegistryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Deklaratsiya roʻyxat raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Roʻyxat raqamini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>
        {/* Fayl yuklash uchun alohida Card */}
        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <FormField
            name="declarationPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Sanoat xavfsizligi deklaratsiyasi titul varagʻi nusxasi (skan-kopiya)
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
          <FormField
            name="agreementPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Sanoat xavfsizligi deklaratsiyasini kelishilganlik titul varagʻi nusxasi (skan-kopiya)
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
        </CardForm>
        <Button type="submit" className="mt-5">
          {form.formState.isSubmitting ? 'Yuborilmoqda...' : 'Ariza yaratish'}
        </Button>
      </form>
    </Form>
  )
}
