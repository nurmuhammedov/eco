import { CardForm } from '@/entities/create-application'
import { useCreateHfApplication } from '@/features/application/create-application'
import { GoBack } from '@/shared/components/common'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'
import { Button } from '@/shared/components/ui/button.tsx'
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
import DatePicker from '@/shared/components/ui/datepicker.tsx'
import { parseISO } from 'date-fns'
import { HF_HAZARDOUS_SIGN_OPTIONS, HF_LEGAL_TYPE_OPTIONS } from '@/shared/constants/hf-attributes'
import { HfCategoryFilesSection } from './parts/hf-category-files-section'

const RegisterHpForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const { form, spheres, regionOptions, districtOptions, hazardousFacilityTypeOptions } = useCreateHfApplication()

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="XICHOni ro‘yxatga olish" />
        <CardForm className="my-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 mb-5 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField
              control={form.control}
              name="upperOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yuqori tashkilotning nomi (mavjud bo‘lsa)</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Yuqori tashkilotning nomi" {...field} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="hfTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>XICHO ning turi</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch('regionId')}>
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
                  <FormLabel required>Xavflilik belgilari</FormLabel>
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
                  <FormLabel required>Tasarruf etish (egalik qilish) huquqiy shakli</FormLabel>
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
                  <FormLabel required>Kadastr raqami</FormLabel>
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
                    <FormLabel required>Foydalanish boshlangan vaqti</FormLabel>
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
          </div>
        </CardForm>

        <CardForm className="mb-5">
          <HfCategoryFilesSection form={form} />
        </CardForm>
        <Button type="submit">Ariza yaratish</Button>
      </form>
    </Form>
  )
}

export default RegisterHpForm
