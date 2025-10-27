// src/features/application/create-application/ui/forms/register-lpg-container-form.tsx
import { CardForm, RegisterIllegalLpgContainerApplicationDTO } from '@/entities/create-application';
import { NoteForm, useCreateIllegalLpgContainerApplication } from '@/features/application/create-application';
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
import { useLegalIipInfo } from '@/features/application/application-detail/hooks/use-legal-iip-info';
import { useIndividualIipInfo } from '@/features/application/application-detail/hooks/use-individual-iip-info';
import DetailRow from '@/shared/components/common/detail-row';
import { parseISO } from 'date-fns';
import { useEffect } from 'react';

interface RegisterIllegalLpgContainerFormProps {
  onSubmit: (data: RegisterIllegalLpgContainerApplicationDTO) => void;
}

export default ({ onSubmit }: RegisterIllegalLpgContainerFormProps) => {
  const { form, regionOptions, districtOptions, childEquipmentOptions, hazardousFacilitiesOptions } =
    useCreateIllegalLpgContainerApplication();

  const identity = form.watch('identity');
  const birthDateString = form.watch('birthDate'); // Qiymatni string sifatida olamiz

  const isLegal = typeof identity === 'string' && identity.trim().length === 9;
  const isIndividual = typeof identity === 'string' && identity.trim().length === 14;

  const { data: legalData, isLoading: isLegalLoading } = useLegalIipInfo(
    identity,
    !!isLegal, // `!!` juda muhim!
  );

  // --- TUZATISH KIRITILGAN JOY ---
  // birthDate'ni string'dan Date obyektiga o'tkazamiz
  const birthDateForHook = birthDateString ? new Date(birthDateString) : undefined;

  const { data: individualData, isLoading: isIndividualLoading } = useIndividualIipInfo(
    identity,
    birthDateForHook, // Hook'ga Date obyektini uzatamiz
    !!(isIndividual && birthDateForHook), // Shartni ham yangi o'zgaruvchi bilan tekshiramiz
  );
  // --- TUZATISH TUGADI ---

  const data = isLegal ? legalData : individualData;
  const isLoading = isLegalLoading || isIndividualLoading;

  useEffect(() => {
    // Faqat `identity` 14 xonali string bo'lganda ishlaymiz
    if (typeof identity === 'string' && identity.trim().length === 14) {
      try {
        const pin = identity.trim();

        // JSHSHIRdan kerakli qismlarni ajratib olamiz (indekslar 0 dan boshlanadi)
        const day = parseInt(pin.substring(1, 3), 10);
        const month = parseInt(pin.substring(3, 5), 10) - 1; // JavaScript'da oylar 0-11 oralig'ida
        const yearDigits = parseInt(pin.substring(5, 7), 10);

        // Yilni hisoblaymiz
        const year = yearDigits > 40 ? 1900 + yearDigits : 2000 + yearDigits;

        // Sana obyektini yaratamiz
        const calculatedDate = new Date(year, month, day);

        // Yaratilgan sana to'g'riligini tekshiramiz
        if (!isNaN(calculatedDate.getTime())) {
          // `birthDate` maydonini yangi sana bilan yangilaymiz
          form.setValue('birthDate', calculatedDate.toISOString(), { shouldValidate: true });
        }
      } catch (error) {
        console.error('JSHSHIRdan sanani ajratishda xatolik:', error);
        // Xatolik yuz bersa, maydonni tozalashimiz mumkin
        form.setValue('birthDate', undefined, { shouldValidate: true });
      }
    }
  }, [identity, form.setValue]);

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Bosim ostida ishlovchi idishlarni (SUG) ro‘yxatga olish" />
        <NoteForm equipmentName="idish (SUG)" />

        <CardForm className="my-2">
          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-4/5 mb-5">
            <FormField
              control={form.control}
              name="identity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>STIR yoki JSHSHIR</FormLabel>
                  <FormControl>
                    <Input className={'w-full 3xl:w-sm'} placeholder="STIR yoki JSHSHIRni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isIndividual && (
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => {
                  const dateValue = field.value ? new Date(field.value) : undefined;
                  const validDate = dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined;
                  return (
                    <FormItem>
                      <FormLabel required>Tug'ilgan sana</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={validDate} // DatePicker'ga tayyor Date obyektini beramiz
                          onChange={field.onChange}
                          placeholder="Sanani tanlang"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}
          </div>
          {isLoading && <div className="">Yuklanmoqda...</div>}
          {data && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {isLegal ? "Tashkilot ma'lumotlari" : "Fuqaro ma'lumotlari"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-4">
                <DetailRow
                  title={isLegal ? 'Tashkilot nomi:' : 'F.I.SH:'}
                  value={data?.name || data?.fullName || '-'}
                />
                {isLegal && <DetailRow title="Tashkilot rahbari F.I.SH:" value={data?.directorName || '-'} />}
                {isLegal && <DetailRow title="Manzil:" value={data?.address || data?.legalAddress || '-'} />}
                {isLegal && <DetailRow title="Telefon raqami:" value={data?.phoneNumber || '-'} />}
              </div>
            </div>
          )}
        </CardForm>
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
            <FormField
              control={form.control}
              name="hazardousFacilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>XICHO‘ tanlang</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="XICHO‘ni tanlang" />
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
              name="childEquipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Idish (SUG) turini tanlang</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Idish (SUG) turini tanlang" />
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
                  <FormLabel>Idishning (SUG) zavod raqami</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Qurilmaning zavod raqami" {...field} />
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
                  <FormLabel>Idishning (SUG) egasining nomi</FormLabel>
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
                  <FormLabel>Model, marka</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Model, marka" {...field} />
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
                    <FormLabel>Ishlab chiqarilgan sana</FormLabel>
                    <DatePicker
                      disableStrategy={'after'}
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Ishlab chiqarilgan sana"
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
                  <FormLabel required>Idish (SUG) joylashgan viloyat</FormLabel>
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
                        <SelectValue placeholder="Qurilma joylashgan viloyat" />
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
                  <FormLabel required>Idish (SUG) joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                      disabled={!form.watch('regionId')}
                    >
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Qurilma joylashgan tuman" />
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
                  <FormLabel required>Idishning (SUG) joylashgan manzili</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Qurilmaning joylashgan manzili" {...field} />
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
                  <FormLabel required>Geolokatsiya (xaritadan joyni tanlang va koordinatalarni kiriting)</FormLabel>
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
            <FormField
              control={form.control}
              name="partialCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full 3xl:w-sm">
                    <FormLabel>O‘tkazilgan tashki (NO), ichki koʻrik (VO) yoki gidrosinov (GI) sanasi</FormLabel>
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
            <FormField
              control={form.control}
              name="fullCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full 3xl:w-sm">
                    <FormLabel>O‘tkaziladigan tashki (NO), ichki koʻrik (VO) yoki gidrosinov (GI) sanasi</FormLabel>
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
            <FormField
              control={form.control}
              name="nonDestructiveCheckDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full 3xl:w-sm">
                    <FormLabel>Oxirgi o‘tkazilgan putur yetkazmaydigan nazorat sanasi</FormLabel>
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
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hajmi</FormLabel>
                  <FormControl>
                    <Input type="text" className="w-full 3xl:w-sm" placeholder="Hajmi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Muhit</FormLabel>
                  <FormControl>
                    <Input type="text" className="w-full 3xl:w-sm" placeholder="Muhit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ruxsat etilgan bosim</FormLabel>
                  <FormControl>
                    <Input type="text" className="w-full 3xl:w-sm" placeholder="Ruxsat etilgan bosim" {...field} />
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Idishning (SUG) birkasi bilan sur‘ati</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="labelExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="saleContractPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sotib olish-sotish shartnomasi fayli</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="saleContractExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Idish (SUG) sertifikati fayli</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equipmentCertExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="assignmentDecreePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                      Mas‘ul shaxs tayinlanganligi to‘g‘risida buyruq fayli
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
              name="assignmentDecreeExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="expertisePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ekspertiza loyihasi fayli</FormLabel>
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
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="installationCertPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Montaj guvohnomasi fayli</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="installationCertExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="additionalFilePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qurilma pasporti</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalFileExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel>Amal qilish muddati</FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Amal qilish muddati"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </CardForm>
        <Button type="submit" className="mt-5" disabled={!form.formState.isValid}>
          Ariza yaratish
        </Button>
      </form>
    </Form>
  );
};
