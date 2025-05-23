import { GoBack } from '@/shared/components/common';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { CardForm } from '@/entities/create-application';
import DatePicker from '@/shared/components/ui/datepicker';
import { Textarea } from '@/shared/components/ui/textarea';
import { InputFile } from '@/shared/components/common/file-upload';
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal';
import { NoteForm, useCreateCraneApplication } from '@/features/create-application';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

export default () => {
  const { form, handleSubmit, regionOptions, districtOptions, childEquipmentOptions } = useCreateCraneApplication();


  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(handleSubmit)}>
        <GoBack title="Kranni ro'yxatga olish" />
        <NoteForm equipmentName="kran" />
        <CardForm className="mb-2">
          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
            <FormField
              control={form.control}
              name="hazardousFacilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>XICHO</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="XICHO ni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={'null'}>Mavjud emas</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="childEquipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kran turini tanlang</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Kran turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{childEquipmentOptions}</SelectContent>
                    </Select>
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
                  <FormLabel required>Kranning zavod raqami</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Kranning zavod raqami" {...field} />
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
                  <FormLabel required>Model, marka</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Model, marka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boomLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className="w-full 3xl:w-sm">
                    Strelasining uzinligi
                  </FormLabel>
                  <FormControl>
                    <Input
                      min={1}
                      type="number"
                      className="w-full 3xl:w-sm"
                      placeholder="Strelasining uzinligi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="liftingCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Yuk ko'tara olish</FormLabel>
                  <FormControl>
                    <Input
                      min={1}
                      type="number"
                      className="w-full 3xl:w-sm"
                      placeholder="Yuk ko'tara olish"
                      {...field}
                    />
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
                  <FormLabel required>Ishlab chiqargan zavod nomi</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Ishlab chiqargan zavod nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturedAt"
              render={({ field }) => (
                <FormItem className="w-full 3xl:w-sm">
                  <FormLabel required>Ishlab chiqarilgan sana</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} placeholder="Ishlab chiqarilgan sana" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partialCheckDate"
              render={({ field }) => (
                <FormItem className="w-full 3xl:w-sm">
                  <FormLabel required>Qisman texnik ko'rik sanasi</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} placeholder="Qisman texnik ko'rik sanasi" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullCheckDate"
              render={({ field }) => (
                <FormItem className="w-full 3xl:w-sm">
                  <FormLabel required>To'liq texnik ko'rik sanasi</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} placeholder="To'liq texnik ko'rik sanasi" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kran joylashgan viloyat</FormLabel>
                  <FormControl>
                      <Select
                          onValueChange={(value) => {
                              if (value) {
                                  field.onChange(value);
                                  form.setValue('districtId', '');
                              }
                          }}
                          value={field.value}
                      >
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Kran joylashgan viloyat" />
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
                  <FormLabel required>Kran joylashgan tuman</FormLabel>
                  <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Kran joylashgan tuman" />
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
                  <FormLabel required>Qurilma joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Qurilma joylashgan manzil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full 3xl:w-sm">
                  <FormLabel required>Joylashuv</FormLabel>
                  <FormControl>
                    <YandexMapModal
                      initialCoords={field.value}
                      onConfirm={(coords) => field.onChange(coords)}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="labelPath"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kranning birkasi bilan surati</FormLabel>
                  <FormControl>
                    <InputFile className="w-full 3xl:w-sm" form={form} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Ariza bayoni</FormLabel>
                <FormControl>
                  <Textarea rows={6} className="3xl:w-4/6" placeholder="Ariza bayoni" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardForm>
        <CardForm className="grid grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-4">
          <FormField
            name="saleContractPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Sotib olish-sotish shartnomasi fayli
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="expertisePath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Ekspertiza loyihasi fayli
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
            name="equipmentCertPath"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Qurilma sertifikati fayli
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
            name="assignmentDecreePath"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Masʼul shaxs tayinlanganligi to‘g‘risida buyruq fayli
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
            name="installationCertPath"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Montaj guvohnomasi fayli(avtokrandan tashqari)
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
            name="additionalFilePath"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Qo'shimcha ma'lumotlar
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </CardForm>
        <Button type="submit" className="mt-5">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  );
};
