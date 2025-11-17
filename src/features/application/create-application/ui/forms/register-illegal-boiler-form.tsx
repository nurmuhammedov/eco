// src/features/application/create-application/ui/forms/register-boiler-form.tsx
import { CardForm, RegisterIllegalBoilerApplicationDTO } from '@/entities/create-application';
import { NoteForm } from '@/features/application/create-application';
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
import { formatDate, parseISO } from 'date-fns';
import { useCreateIlleagalBoilerApplication } from '@/features/application/create-application/model/use-create-illegal-boiler-application.ts';
import DetailRow from '@/shared/components/common/detail-row';
import useAdd from '@/shared/hooks/api/useAdd';
import { useMemo, useState } from 'react';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { useQuery } from '@tanstack/react-query';
import { getHfoByTinSelect } from '@/entities/expertise/api/expertise.api';

interface RegisterBoilerFormProps {
  onSubmit: (data: RegisterIllegalBoilerApplicationDTO) => void;
}

export default ({ onSubmit }: RegisterBoilerFormProps) => {
  const { form, regionOptions, districtOptions, childEquipmentOptions } = useCreateIlleagalBoilerApplication();
  const [data, setData] = useState<any>(undefined);

  const identity = form.watch('identity');
  const birthDateString = form.watch('birthDate');

  const isLegal = typeof identity === 'string' && identity.trim().length === 9;
  const isIndividual = typeof identity === 'string' && identity.trim().length === 14;

  const { data: hfoOptions } = useQuery({
    queryKey: ['hfoSelect', identity],
    queryFn: () => getHfoByTinSelect(identity),
    enabled: !!identity && identity.length === 9 && !!data,
    retry: 1,
  });

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hfoOptions || []), [hfoOptions]);

  const { mutateAsync, isPending } = useAdd<any, any, any>('/integration/iip/legal');
  const { mutateAsync: individualMutateAsync, isPending: individualIsLoading } = useAdd<any, any, any>(
    '/integration/iip/individual',
  );

  const handleSearch = () => {
    if (form?.formState?.errors?.birthDate || form?.formState?.errors?.identity) {
      form.trigger(['identity', 'birthDate']).then((r) => console.log(r));
    } else if (identity?.length === 9) {
      mutateAsync({ tin: identity }).then((res) => {
        setData(res.data);
      });
    } else if (identity?.length === 14) {
      individualMutateAsync({ pin: identity, birthDate: formatDate(birthDateString || new Date(), 'yyyy-MM-dd') }).then(
        (res) => {
          setData(res.data);
        },
      );
    }
  };

  const handleClear = () => {
    setData(undefined);

    form.setValue('identity', '');
    form.setValue('birthDate', '');
    form.setValue('hazardousFacilityId', undefined);
  };

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Bug‘ qozonni ro‘yxatga olish" />
        <NoteForm equipmentName="qozon" />

        <CardForm className="my-2">
          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-4/5 mb-5">
            <FormField
              control={form.control}
              name="identity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>STIR yoki JSHSHIR</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!!data}
                      className="w-full 3xl:w-sm"
                      placeholder="STIR yoki JSHSHIRni kiriting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isIndividual && (
              // <FormField
              //   control={form.control}
              //   name="birthDate"
              //   render={({ field }) => {
              //     const dateValue = field.value ? new Date(field.value) : undefined;
              //     const validDate = dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined;
              //     return (
              //       <FormItem>
              //         <FormLabel required>Tug'ilgan sana</FormLabel>
              //         <FormControl>
              //           <DatePicker
              //             className="w-full 3xl:w-sm"
              //             value={validDate}
              //             onChange={field.onChange}
              //             placeholder="Sanani tanlang"
              //           />
              //         </FormControl>
              //         <FormMessage />
              //       </FormItem>
              //     );
              //   }}
              // />
              <div>
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                    return (
                      <FormItem className="w-full  3xl:w-sm">
                        <FormLabel>Tug‘ilgan sana</FormLabel>
                        <DatePicker
                          disabled={!!data}
                          className="w-full 3xl:w-sm"
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Sanani tanlang"
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            )}
            <div className="w-full 3xl:w-sm flex items-end justify-start gap-2">
              {!data ? (
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={
                    isPending ||
                    individualIsLoading ||
                    !identity ||
                    (identity.length !== 9 && identity.length !== 14) ||
                    (!birthDateString && identity.length == 14)
                  }
                  loading={isPending || individualIsLoading}
                >
                  Qidirish
                </Button>
              ) : (
                <Button type="button" variant="destructive" onClick={handleClear}>
                  O‘chirish
                </Button>
              )}
            </div>
          </div>
          {data && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {isLegal ? 'Tashkilot maʼlumotlari' : 'Fuqaro maʼlumotlari'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-4">
                <DetailRow
                  title={isLegal ? 'Tashkilot nomi:' : 'F.I.SH:'}
                  value={data?.name || data?.fullName || '-'}
                />
                {isLegal && (
                  <DetailRow title="Tashkilot rahbari F.I.SH:" value={data?.directorName || data?.fullName || '-'} />
                )}
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
                  <FormLabel required>Qozon turini tanlang</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Qozon turini tanlang" />
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
                  <FormLabel>Qozonning zavod raqami</FormLabel>
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
                  <FormLabel>Qozonni ishlab chiqargan zavod nomi</FormLabel>
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
                  <FormLabel required>Qozon joylashgan viloyat</FormLabel>
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
                  <FormLabel required>Qozon joylashgan tuman</FormLabel>
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
                  <FormLabel required>Qozon joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Qurilma joylashgan manzil" {...field} />
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
                  <FormLabel required>Joylashuv (xaritadan joyni tanlang va koordinatalarni kiriting)</FormLabel>
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
                    <FormLabel>Tashqi va ichki ko‘rik sanasi</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Tashqi va ichki ko‘rik sanasini kiriting"
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
                    <FormLabel>Gidrosinov o‘tkazish sanasi</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Gidrosinov sanasini kiriting"
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
                    <FormLabel>Putur yetkazmaydigan nazoratdan o‘tkazish sanasi</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Putur yetkazmaydigan nazorat sanasi"
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
                  <FormLabel>Muhit</FormLabel>
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qozonning birkasi bilan sur‘ati</FormLabel>
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qurilma sertifikati fayli</FormLabel>
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
                <FormItem className="mb-2">
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qo‘shimcha ma‘lumotlar</FormLabel>
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
                  </FormItem>
                );
              }}
            />
          </div>
        </CardForm>
        <Button type="submit" className="mt-5" disabled={!data}>
          Ariza yaratish
        </Button>
      </form>
    </Form>
  );
};
