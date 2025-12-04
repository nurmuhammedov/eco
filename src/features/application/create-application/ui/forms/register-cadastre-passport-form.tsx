import { CardForm, CreateCadastrePassportApplicationDTO } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCreateCadastrePassportApplication } from '../../model/use-create-cadastre-passport-application'

interface RegisterCraneFormProps {
  onSubmit: (data: CreateCadastrePassportApplicationDTO) => void
}

export default ({ onSubmit }: RegisterCraneFormProps) => {
  const { form, regionOptions, districtOptions, hazardousFacilitiesOptions } = useCreateCadastrePassportApplication()

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="TXYZ kadastr pasportini ro‘yxatga olish" />
        <CardForm className="my-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
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
                    <Input
                      disabled
                      className="3xl:w-sm w-full"
                      placeholder="XICHO nomini kiriting"
                      {...field}
                      value={field.value ?? ''}
                    />
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
                  <FormLabel required>TXYZ manzili</FormLabel>
                  <FormControl>
                    <Input disabled className="3xl:w-sm w-full" placeholder="Manzilni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationTin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tashkilot STIR</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="STIRni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>TXYZ kadastr pasportini ishlab chiqqan tashkilot nomi</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Tashkilot nomini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 3 */}
            <FormField
              control={form.control}
              name="organizationAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>TXYZ kadastr pasportini ishlab chiqqan tashkilot manzili</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Tashkilot manzilini kiriting" {...field} />
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
                  <FormLabel required>TXYZ joylashgan viloyat</FormLabel>
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
                  <FormLabel required>TXYZ joylashgan tuman</FormLabel>
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
            {/* Row 5 */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Telefon raqam</FormLabel>
                  <FormControl>
                    <PhoneInput className="3xl:w-sm w-full" placeholder="+998 XX XXX XX XX" {...field} />
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
                  <FormLabel required>TXYZ lokatsiyasi</FormLabel>
                  <FormControl>
                    <YandexMapModal
                      initialCoords={field.value ? field.value.split(',').map(Number) : null}
                      onConfirm={(coords) => field.onChange(coords)}
                      label="Xaritadan belgilash"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <FormField
            control={form.control}
            name="passportPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>TXYZ kadastr pasporti titul varag'i nusxasi</FormLabel>
                <FormControl>
                  <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreementPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>TXYZ kadastr pasportining kelishilganlik titul varag'i nusxasi</FormLabel>
                <FormControl>
                  <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                </FormControl>
              </FormItem>
            )}
          />
        </CardForm>
        <Button type="submit" className="mt-5">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  )
}
