import { CardForm, CreateAttractionApplicationDTO } from '@/entities/create-application';
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
import { useCreateAttractionApplication } from '@/features/application/create-application';

interface RegisterAttractionFormProps {
  onSubmit: (data: CreateAttractionApplicationDTO) => void;
}

export default ({ onSubmit }: RegisterAttractionFormProps) => {
  const { form, regionOptions, districtOptions, attractionNameOptions, attractionSortOptions, riskLevelOptions } =
    useCreateAttractionApplication();

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Attraksion ro‘yxatga olish" />

        <CardForm className="my-2">
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
                    <Select onValueChange={(val) => field.onChange(val)} value={String(field.value || '')}>
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
                      onValueChange={(val) => field.onChange(val)}
                      value={String(field.value || '')}
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

            <FormField
              control={form.control}
              name="factory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attraksionni ishlab chiqaruvchi zavod nomi</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Zavod nomi" {...field} />
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
            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="servicePeriod"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel required>Xizmat muddati (yil)</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input className="w-full 3xl:w-sm" placeholder="Xizmat muddati" {...field} />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}
            <FormField
              control={form.control}
              name="servicePeriod"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full 3xl:w-sm">
                    <FormLabel required>Xizmat muddati</FormLabel>
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
                        field.onChange(v);
                        form.setValue('districtId', 0);
                      }}
                      value={String(field.value || '')}
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
                      onValueChange={(v) => field.onChange(v)}
                      value={String(field.value || '')}
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
                  <FormLabel required>
                    Geolokatsiya (xaritadan attraksion joylashgan joyni tanlang va koordinatalarini kiriting)
                  </FormLabel>
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
                  <FormLabel required> Attraksionning biomexanik xavf darajasi</FormLabel>
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

          <div className="pb-4 border-b">
            <FormField
              name="labelPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required>Attraksionning surati</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="pb-4 border-b">
            <FormField
              name="passportPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className={'mb-2'}>
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required>
                      Attraksion ishlab chiqaruvchisi tomonidan va (yoki) ixtisoslashtirilgan tashkilot tomonidan
                      tayyorlangan attraksion pasporti
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
              name="conformityCertPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel>
                      Muvofiqlik sertifikati yoki muvofiqlik to‘g‘risidagi deklaratsiyaning nusxasi (2023 yil 28 maydan
                      so‘ng muomalaga kiritilgan attraksionlar uchun - majburiy, qolgan attraksionlar uchun - mavjud
                      bo‘lsa)
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="technicalJournalPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className={'mb-2'}>
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>
                    Kundalik texnik xizmat ko‘rsatish attraksion ishlari boshlanishidan oldin olib boriladi. Natijalar
                    bo‘yicha attraksionlardan xavfsiz foydalanishga javobgar shaxs attraksionni kundalik foydalanishga
                    ruxsat berganligi to‘g‘rida jurnali.
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <div className="pb-4 border-b">
            <FormField
              name="seasonalInspectionPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required>
                      Mavsumiy foydalaniladigan attraksionlar to‘liq texnik shahodat sinovlaridan o‘tganligi to‘g‘risida
                      ma’lumotlar.
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
              name="seasonalInspectionExpiryDate"
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
              name="seasonalReadinessActPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required>
                      Bog‘ attraksionining mavsumga tayyorligi to‘g‘risidagi dalolatnomasi.
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
              name="seasonalReadinessActExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel required>Amal qilish muddati</FormLabel>
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
              name="servicePlanPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel>
                      Attraksionlarga davriy texnik xizmat ko‘rsatish attraksion egasi yoki attraksionni ijaraga olgan
                      shaxs tomonidan tasdiqlangan reja-jadvali.
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
              name="servicePlanExpiryDate"
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
              name="technicalManualPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel>
                      Texnik shahodat sinovlari attraksiondan foydalanish qo‘llanmasi va mazkur Qoidalar talablariga
                      muvofiq attraksionlarni soz holatda saqlash va xavfsiz foydalanish uchun mas’ul bo‘lgan mutaxassis
                      boshchiligida amalga oshiriladi. Mas’ul mutaxasis buyrug‘i
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
              name="technicalManualExpiryDate"
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
              name="employeeSafetyKnowledgePath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required>
                      Bog‘ xodimlarning mehnatni muhofaza qilish bo‘yicha bilimlarini sinovdan o‘tganligi to‘g‘risida
                      ma’lumot.
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
              name="employeeSafetyKnowledgeExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel required>Amal qilish muddati</FormLabel>
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
              name="usageRightsPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required>Ruxsatnoma</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usageRightsExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel required>Amal qilish muddati</FormLabel>
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

          <FormField
            name="technicalReadinessActPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required>
                    Attraksionlarning texnik tayyorligi dalolatnomasi ( yangi o‘rnatilgan 2023 yil 28 maydan so‘ng
                    muomalaga kiritilgan attraksionlar uchun - majburiy, qolgan attraksionlar uchun - mavjud bo‘lsa)
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <div className="pb-4 border-b">
            <FormField
              name="preservationActPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-2">
                  <div className="flex items-end xl:items-center justify-between gap-2">
                    <FormLabel required>Attraksionga video kuzatuv moslamasi o’rnatilganligi surati</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preservationActExpiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full">
                    <div className="flex items-end xl:items-center justify-between gap-2 mb-2">
                      <FormLabel required>
                        Attraksionni saqlashga qo’yish dalolatnomasi (ushbu ilovani muddati bo’ladi)
                      </FormLabel>
                      <DatePicker
                        className={'max-w-2/3'}
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        disableStrategy={'before'}
                        placeholder="Attraksionni saqlashga qo’yish dalolatnomasi"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            name="qrPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel>Attraksionga QR kod axborot taxtachasiga o’rnatilganligi surati</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE]} />
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
