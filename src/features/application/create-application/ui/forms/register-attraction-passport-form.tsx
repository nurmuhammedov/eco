import { CardForm, CreateAttractionPassportApplicationDTO } from '@/entities/create-application';
import { NoteForm } from '@/features/application/create-application';
import { useCreateAttractionPassportApplication } from '@/features/application/create-application/model/use-create-attraction-passport-application';
import { GoBack } from '@/shared/components/common';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types';
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal';
import { Button } from '@/shared/components/ui/button';
import DatePicker from '@/shared/components/ui/datepicker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { PhoneInput } from '@/shared/components/ui/phone-input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { parseISO } from 'date-fns';

interface RegisterAttractionPassportFormProps {
  onSubmit: (data: CreateAttractionPassportApplicationDTO) => void;
}

export default ({ onSubmit }: RegisterAttractionPassportFormProps) => {
  const { form, regionOptions, districtOptions, attractionNameOptions, attractionSortOptions, riskLevelOptions } =
    useCreateAttractionPassportApplication();

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Attraksion pasportini ro‘yxatga olish" />
        <NoteForm equipmentName="attraksion pasporti" />

        {/* Asosiy maydonlar */}
        <CardForm className="mb-2">
          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
            {/* Telefon raqami */}
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
            {/* Attraksion nomi */}
            <FormField
              control={form.control}
              name="attractionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion nomi</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Attraksion nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Attraksion turi */}
            <FormField
              control={form.control}
              name="childEquipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion turi</FormLabel>
                  <FormControl>
                    <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Attraksion turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{attractionNameOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Attraksion tipi */}
            <FormField
              control={form.control}
              name="childEquipmentSortId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion tipi</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={String(field.value)}
                      disabled={!form.watch('childEquipmentId')}
                    >
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Attraksion tipini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{attractionSortOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Ishlab chiqarilgan sana */}
            <FormField
              control={form.control}
              name="manufacturedAt"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full 3xl:w-sm">
                    <FormLabel required>Attraksion ishlab chiqarilgan sana</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {/* Dastlabki foydalanishga qabul qilingan sana */}
            <FormField
              control={form.control}
              name="acceptedAt"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full 3xl:w-sm">
                    <FormLabel required>Dastlabki foydalanishga qabul qilingan sana</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {/* Xizmat muddati (yil) */}
            <FormField
              control={form.control}
              name="servicePeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Xizmat muddati (yil)</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Xizmat muddati" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Attraksion zavod raqami */}
            <FormField
              control={form.control}
              name="factoryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion zavod raqami</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Zavod raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Ishlab chiqarilgan mamlakat */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion ishlab chiqarilgan mamlakat</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Mamlakat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Viloyat va Tuman */}
            <FormField
              control={form.control}
              name="regionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(Number(v));
                        form.setValue('districtId', 0);
                      }}
                      value={String(field.value)}
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
                  <FormLabel required>Attraksion joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String(field.value)}
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
            {/* Manzil va Geolokatsiya */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksion joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Aniq manzil" {...field} />
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
                  <FormLabel required>Geolokatsiya</FormLabel>
                  <FormControl>
                    <YandexMapModal
                      initialCoords={field.value ? field.value.split(',').map(Number) : null}
                      onConfirm={(coords) => field.onChange(coords)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Biomechanik xavf darajasi (toifa) */}
            <FormField
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksionning biomexanik xavf darajasi (toifa)</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Xavf darajasini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{riskLevelOptions}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        {/* Fayl yuklash maydonlari */}
        <CardForm className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-4 mb-5">
          {/* Barcha fayllar uchun FormField'lar shu yerga qo'shiladi */}
          <FormField
            name="labelPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>Attraksionning birkasi bilan surati</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="passportPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>Attraksion pasporti fayli</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="equipmentCertPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>Attraksion sertifikati fayli</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="acceptanceCertPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>Attraksionni foydalanishga qabul qilish guvohnomasi fayli</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="assignmentDecreePath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>Masʼul shaxs tayinlanganligi toʻgʻrisida buyruq fayli</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="techReadinessActPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>Attraksion texnik tayyorligi toʻgʻrisida dalolatnoma</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="seasonalReadinessActPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>Attraksion mavsumga tayyorligi toʻgʻrisida dalolatnoma</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="safetyDecreePath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>
                    Attraksionni soz holatda va undan xavfsiz foydalanish boʻyicha masʼul shaxs buyrugʻi
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </CardForm>

        <Button type="submit" className="mt-5" disabled={!form.formState.isValid}>
          Ariza yaratish
        </Button>
      </form>
    </Form>
  );
};
