import { CardForm } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
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
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCreateIllegalHFApplication } from '@/features/application/create-application/model/use-create-illegal-hf-applicaton'
import { useLegalApplicantInfo } from '@/features/application/application-detail/hooks/use-legal-applicant-info'
import DetailRow from '@/shared/components/common/detail-row'

export default ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const { form, spheres, regionOptions, districtOptions, hazardousFacilityTypeOptions } =
    useCreateIllegalHFApplication()

  const legalTin = form.watch('legalTin')

  const { data, isLoading: isLegalInfoLoading } = useLegalApplicantInfo(legalTin, legalTin?.trim()?.length === 9)

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="XICHOni ro‘yxatga olish" />
        <CardForm className="my-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
            <FormField
              control={form.control}
              name="legalTin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>STIR</FormLabel>
                  <FormControl>
                    <Input className={'3xl:w-sm w-full'} placeholder="STIRni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isLegalInfoLoading && <div className=""></div>}

          {data && (
            <div className="mt-6 border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Tashkilot ma'lumotlari</h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-1">
                <DetailRow title="Tashkilot nomi:" value={data?.name || '-'} />
                <DetailRow title="Tashkilot rahbari F.I.SH:" value={data?.directorName || '-'} />
                <DetailRow title="Tashkilot manzili:" value={data?.address || '-'} />
                <DetailRow title="Tashkilot telefon raqami:" value={data?.phoneNumber || '-'} />
              </div>
            </div>
          )}
        </CardForm>
        <CardForm className="my-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
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
                  <FormLabel required>Bog'lanish uchun telefon raqami</FormLabel>
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
                  <FormLabel>XICHO ning turi</FormLabel>
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
                // <FormItem> butun blokni o'rab turadi
                <FormItem className="flex flex-col">
                  <FormLabel>Tarmoqlar</FormLabel>
                  <FormControl>
                    {/* MultiSelect'ni FormControl ichiga joylaymiz */}
                    <MultiSelect
                      className="3xl:w-sm w-full" // Bu klasslar balandlikni to'g'rilashga yordam beradi
                      value={field.value || []}
                      onChange={field.onChange}
                      options={spheres}
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                      initialCoords={field.value ? [field.value] : null}
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
                  <FormLabel className="3xl:w-sm w-full">XICHO sexlari, uchastkalari va maydonchalari nomi</FormLabel>
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
                  <FormLabel className="3xl:w-sm w-full">Xavfli moddalarning nomi va miqdori</FormLabel>
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
          </div>
        </CardForm>
        <CardForm className="mb-5 grid grid-cols-2 gap-x-8 gap-y-4 2xl:grid-cols-3">
          <FormField
            name="projectDocumentationPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel>Loyiha hujjatlari(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insurancePolicyPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel>Sug‘urta polisi(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appointmentOrderPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel>Ma'sul xodim tayinlanganligi buyrug‘i(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identificationCardPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Identifikatsiya varag‘i(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expertOpinionPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ekspertiza xulosasi(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licensePath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Litsenziya(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ecologicalConclusionPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ekologiya qo‘mitasidan xulosasi(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="permitPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ruxsatnoma(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receiptPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                    XICHOni ro‘yxatga olish uchun to‘lov kvitansiyasi(PDF)
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="certificationPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                    XICHO xodimlarning sanoat xavfsizligi bo‘yicha attestatsiyadan o‘tganligi(PDF)
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cadastralPassportPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">XICHO kadastr pasporti(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="replyLetterPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Yong‘in xavfsizligi xulosasi(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industrialSafetyDeclarationPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sanoat xavfsizligi deklaratsiyasi(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deviceTestingPath"
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qurilmalarni sinovdan o‘tganligi(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </CardForm>
        <Button type="submit">Ariza yaratish</Button>
      </form>
    </Form>
  )
}
