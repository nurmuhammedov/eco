import { CardForm, CreateCraneApplicationDTO } from '@/entities/create-application';
import { NoteForm, useCreateCraneApplication } from '@/features/application/create-application';
import { GoBack } from '@/shared/components/common';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal';
import { Button } from '@/shared/components/ui/button';
import DatePicker from '@/shared/components/ui/datepicker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { PhoneInput } from '@/shared/components/ui/phone-input.tsx';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useAuth } from '@/shared/hooks/use-auth';
import { parseISO } from 'date-fns';
import { UserRoles } from '@/entities/user';

interface RegisterCraneFormProps {
  onSubmit: (data: CreateCraneApplicationDTO) => void;
}

export default ({ onSubmit }: RegisterCraneFormProps) => {
  const { form, regionOptions, districtOptions, childEquipmentOptions, hazardousFacilitiesOptions } =
    useCreateCraneApplication();
  const { user } = useAuth();

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Kranni roʻyxatga olish" />
        <NoteForm equipmentName="kran" />
        <CardForm className="mb-2">
          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Telefon raqami</FormLabel>
                  <FormControl>
                    <PhoneInput className="w-full 3xl:w-sm" placeholder="+998 XX XXX XX XX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {user?.role !== UserRoles.INDIVIDUAL && (
              <FormField
                control={form.control}
                name="hazardousFacilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>XICHO ni tanlang</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger className="w-full 3xl:w-sm">
                          <SelectValue placeholder="XICHO ni tanlang (ixtiyoriy)" />
                        </SelectTrigger>
                        <SelectContent>{hazardousFacilitiesOptions}</SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="childEquipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kran turini tanlang</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
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
              name="factory"
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
                  <FormLabel required>Strelasining uzunligi (m)</FormLabel>
                  <FormControl>
                    <Input type="text" className="w-full 3xl:w-sm" placeholder="Strelasining uzunligi" {...field} />
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
                  <FormLabel required>Yuk koʻtara olish quvvati (tonna)</FormLabel>
                  <FormControl>
                    <Input type="text" className="w-full 3xl:w-sm" placeholder="Yuk koʻtara olish quvvati" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturedAt"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full 3xl:w-sm">
                    <FormLabel required>Ishlab chiqarilgan sana</FormLabel>
                    <DatePicker
                      disableStrategy={'after'}
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="partialCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full 3xl:w-sm">
                    <FormLabel required>Qisman texnik koʻrik sanasi</FormLabel>
                    <DatePicker
                      disableStrategy={'after'}
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="fullCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full 3xl:w-sm">
                    <FormLabel required>Toʻliq texnik koʻrik sanasi</FormLabel>
                    <DatePicker
                      disableStrategy={'after'}
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
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
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="w-full 3xl:w-sm">
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
                  <FormLabel required>Kran joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                      disabled={!form.watch('regionId')}
                    >
                      <SelectTrigger className="w-full 3xl:w-sm">
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
                  <FormLabel required>Qurilma joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Aniq manzilni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full 3xl:w-sm">
                  <FormLabel required>Joylashuv (Xarita)</FormLabel>
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

        <CardForm className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-4 mb-5">
          <div className="pb-4 border-b">
            <FormField
              name="labelPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Kranning birkasi bilan surati
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE, FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="assignmentDecreePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Masʼul shaxs tayinlanganligi to‘g‘risida buyruq
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="saleContractPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Oldi-sotdi shartnomasi (egalik huquqini beruvchi hujjat)
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="expertisePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                      Ekspertiza xulosasi (ishlash muddatini o‘tagan bo‘lsa majburiy)
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expertiseExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel>Amal qilish sanasi</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish sanasi"
                      />
                    </div>
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="equipmentCertPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                      Kran muvofiqlik sertifikati (muqaddam foydalanishda bo‘lgan kran uchun majburiy emas)
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="installationCertPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                      Montaj dalolatnomasi (Minorali, ko‘rikli, kozlovoy kranlar uchun majburiy)
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="additionalFilePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Kranning pasporti
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="partialCheckPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Kranning qisman texnik ko‘rikdan o‘tkazilganligi
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nextPartialCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel required>Navbatdagi qisman texnik ko‘rik sanasi</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Sanani tanlang"
                      />
                    </div>
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="fullCheckPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                      Kranning to‘liq texnik ko‘rikdan o‘tkazilganligi
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nextFullCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel required>Navbatdagi to‘liq texnik ko‘rik sanasi</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Sanani tanlang"
                      />
                    </div>
                  </FormItem>
                );
              }}
            />
          </div>
        </CardForm>
        <Button type="submit" className="mt-5">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  );
};
