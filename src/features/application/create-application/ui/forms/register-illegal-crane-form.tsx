import { CardForm, RegisterIllegalCraneApplicationDTO } from '@/entities/create-application';
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
import { useCreateIllegalCraneApplication } from '@/features/application/create-application/model/use-create-illegal-crane-application.ts';
import { useMemo, useState } from 'react';
import useAdd from '@/shared/hooks/api/useAdd';
import { useQuery } from '@tanstack/react-query';
import { getHfoByTinSelect } from '@/entities/expertise/api/expertise.api';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import DetailRow from '@/shared/components/common/detail-row';

interface RegisterCraneFormProps {
  onSubmit: (data: RegisterIllegalCraneApplicationDTO) => void;
}

export default ({ onSubmit }: RegisterCraneFormProps) => {
  const { form, childEquipmentOptions, districtOptions, regionOptions } = useCreateIllegalCraneApplication();

  const [data, setData] = useState<any>(undefined);

  const identity = form.watch('identity');
  const birthDateString = form.watch('birthDate');

  const cleanIdentity = identity?.trim() || '';
  const isLegal = cleanIdentity.length === 9;
  const isIndividual = cleanIdentity.length === 14;

  const { mutateAsync: legalMutateAsync, isPending: isLegalPending } = useAdd<any, any, any>('/integration/iip/legal');

  const { mutateAsync: individualMutateAsync, isPending: isIndividualPending } = useAdd<any, any, any>(
    '/integration/iip/individual',
  );

  const { data: hfoOptions } = useQuery({
    queryKey: ['hfoSelect', cleanIdentity],
    queryFn: () => getHfoByTinSelect(cleanIdentity),
    enabled: isLegal && !!data,
    retry: 1,
  });

  const hazardousFacilitiesOptions = useMemo(() => getSelectOptions(hfoOptions || []), [hfoOptions]);

  const handleSearch = () => {
    if (isLegal && !form.formState.errors.identity) {
      legalMutateAsync({ tin: cleanIdentity })
        .then((res) => setData(res.data))
        .catch(() => setData(undefined));
    } else if (isIndividual && birthDateString && !form.formState.errors.birthDate && !form.formState.errors.identity) {
      individualMutateAsync({
        pin: cleanIdentity,
        birthDate: formatDate(birthDateString || new Date(), 'yyyy-MM-dd'),
      })
        .then((res) => setData(res.data))
        .catch(() => setData(undefined));
    } else {
      form.trigger(['identity', 'birthDate']).then((r) => console.log(r));
    }
  };

  const handleClear = () => {
    setData(undefined);
    form.setValue('identity', '');
    form.setValue('birthDate', undefined as unknown as string);
    form.setValue('hazardousFacilityId', undefined);
  };

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Kranni ro‘yxatga olish arizasi" />
        <NoteForm equipmentName="kran" />

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
                      maxLength={14}
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        e.target.value = val;
                        if (data) setData(undefined);
                        form.setValue('hazardousFacilityId', undefined);
                        if (val.length !== 14) {
                          form.setValue('birthDate', undefined as unknown as string);
                        }
                        field.onChange(e);
                      }}
                    />
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
                  const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                  return (
                    <FormItem className="w-full 3xl:w-sm">
                      <FormLabel required>Tug‘ilgan sana</FormLabel>
                      <DatePicker
                        disabled={!!data}
                        className="w-full 3xl:w-sm"
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        placeholder="Sanani tanlang"
                        disableStrategy="after"
                      />
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            <div className="w-full 3xl:w-sm flex items-end justify-start gap-2">
              {!data ? (
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={
                    isLegalPending ||
                    isIndividualPending ||
                    !cleanIdentity ||
                    (!isLegal && !(isIndividual && birthDateString))
                  }
                  loading={isLegalPending || isIndividualPending}
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
                  <>
                    <DetailRow title="Tashkilot rahbari:" value={data?.directorName || '-'} />
                    <DetailRow title="Manzil:" value={data?.address || data?.legalAddress || '-'} />
                  </>
                )}
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

            {isLegal && !!data && (
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
                  <FormLabel>Kranning zavod raqami</FormLabel>
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
                  <FormLabel>Ishlab chiqargan zavod nomi</FormLabel>
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
              name="boomLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strelasining uzunligi (m)</FormLabel>
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
                  <FormLabel>Yuk koʻtara olish quvvati (tonna)</FormLabel>
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
                    <FormLabel>Ishlab chiqarilgan sana</FormLabel>
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
                    <FormLabel>Qisman texnik koʻrik sanasi</FormLabel>
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
                    <FormLabel>Toʻliq texnik koʻrik sanasi</FormLabel>
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Kranning birkasi bilan surati</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.IMAGE, FileTypes.PDF]} />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sotib olish-sotish shartnomasi</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qurilma sertifikati</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
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
                      Masʼul shaxs tayinlanganligi to‘g‘risida buyruq
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ekspertiza loyihasi</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Montaj guvohnomasi (avtokrandan tashqari)</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
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
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qoʻshimcha maʼlumotlar</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
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
        <Button type="submit" className="mt-5" disabled={!data}>
          Ariza yaratish
        </Button>
      </form>
    </Form>
  );
};
