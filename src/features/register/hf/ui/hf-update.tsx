import { CardForm } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'
import { Button } from '@/shared/components/ui/button.tsx'
import DatePicker from '@/shared/components/ui/datepicker.tsx'
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
import { MultiSelect } from '@/shared/components/ui/multi-select'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { parseISO } from 'date-fns'
import { useUpdateHF } from '@/features/register/hf/hooks/use-update-hf'
import { UpdateHFDTO } from '@/features/register/hf/model/update-hf.schema'
import { AppealFormSkeleton } from '@/features/application/create-application'
import { Alert, AlertTitle } from '@/shared/components/ui/alert'
import { TriangleAlert } from 'lucide-react'

export default ({ onSubmit, isPending = false }: { onSubmit: (data: UpdateHFDTO) => void; isPending?: boolean }) => {
  const { form, spheres, regionOptions, districtOptions, hazardousFacilityTypeOptions, orgData, isLoading } =
    useUpdateHF()

  if (isLoading) {
    return <AppealFormSkeleton />
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="XICHOni maʼlumotlarini o‘zgartirish" />
        <Alert className="mt-2 border-yellow-500/50 bg-yellow-500/15">
          <TriangleAlert className="size-4 !text-yellow-600" />
          <AlertTitle className="text-yellow-700">
            Maʼlumotlar lotinda kiritilsin, agar kirilda yozilgan bo‘lsa, tahrirlash jarayonida avtomatik o‘chirib
            yuboriladi!
          </AlertTitle>
        </Alert>
        {orgData && (
          <CardForm className="my-2">
            <h3 className="mb-4 text-base font-semibold text-gray-800">Tashkilot maʼlumotlari</h3>
            <div className="grid grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-1">
              <DetailRow title={'Tashkilot nomi:'} value={orgData?.legalName || '-'} />
              <DetailRow title="Tashkilot rahbari:" value={orgData?.fullName || '-'} />
              <DetailRow title="Manzil:" value={orgData?.address || orgData?.legalAddress || '-'} />
              <DetailRow title="Telefon raqami:" value={orgData?.phoneNumber || '-'} />
            </div>
          </CardForm>
        )}

        <CardForm className="my-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
            <FormField
              control={form.control}
              name="upperOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yuqori tashkilotning nomi</FormLabel>
                  <FormControl>
                    <Input
                      className="3xl:w-sm w-full"
                      placeholder="Yuqori tashkilot (mavjud bo‘lsa)"
                      {...field}
                      value={field?.value || ''}
                    />
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
              control={form.control}
              name="hfTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>XICHO ning turi</FormLabel>
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
                  <FormLabel required>XICHO joylashgan tuman</FormLabel>
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
                  <FormLabel required>Manzil</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Ko‘cha, uy raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Joylashuv (Xarita)</FormLabel>
                  <FormControl>
                    <div className="3xl:w-sm w-full">
                      <YandexMapModal
                        initialCoords={field.value ? field.value.split(',').map(Number) : null}
                        onConfirm={(coords) => field.onChange(coords)}
                        {...field}
                      />
                    </div>
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
                  <FormLabel required>XICHO sexlari va maydonchalari</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Sexlar, uchastkalar nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hazardousSubstance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Xavfli moddalar</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Nomi va miqdori" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>VM 271-son qaroriga muvofiq</FormDescription>
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
                      maxDisplayItems={10}
                      placeholder="Tarmoqlarni tanlang"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <FormLabel required className="max-w-1/2">
                      Identifikatsiya varag‘i
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                  <FormMessage />
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
                    <FormLabel className="max-w-1/2">To‘lov kvitansiyasi</FormLabel>
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
              name="cadastralPassportPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2">XICHO kadastr pasporti</FormLabel>
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
                    <FormLabel className="max-w-1/2">Loyiha hujjatlari</FormLabel>
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
              name="expertOpinionPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2">Loyiha ekspertiza xulosasi</FormLabel>
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
                    <FormLabel className="max-w-1/2">Maʼsul xodim buyrug‘i</FormLabel>
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
              name="industrialSafetyDeclarationPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2">Sanoat xavfsizligi deklaratsiyasi</FormLabel>
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
                    <FormLabel className="max-w-1/2">Sug‘urta polisi</FormLabel>
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
                      <FormLabel className="text-muted-foreground text-xs">Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Sanani tanlang"
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
              name="licensePath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2">Litsenziya</FormLabel>
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
                      <FormLabel className="text-muted-foreground text-xs">Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Sanani tanlang"
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
              name="permitPath"
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2">Ruxsatnoma</FormLabel>
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
                      <FormLabel className="text-muted-foreground text-xs">Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Sanani tanlang"
                      />
                    </div>
                  </FormItem>
                )
              }}
            />
          </div>
        </CardForm>

        <Button type="submit" loading={isPending}>
          Saqlash
        </Button>
      </form>
    </Form>
  )
}
