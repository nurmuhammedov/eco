import { CardForm, AccreditationConclusionDTO } from '@/entities/create-application';
import { GoBack } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input.tsx';
import { useRegisterAccreditationConclusion } from '@/features/application/create-application/model/use-register-accreditation-conclusion.ts';
import { PhoneInput } from '@/shared/components/ui/phone-input.tsx';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select.tsx';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { parseISO } from 'date-fns';
import { useLegalInfo } from '@/shared/hooks/use-legal-info.ts';

interface CreateAccreditationFormProps {
  onSubmit: (data: AccreditationConclusionDTO) => void;
}

export default ({ onSubmit }: CreateAccreditationFormProps) => {
  const { form, regionOptions, districtOptions } = useRegisterAccreditationConclusion();
  const { mutateAsync, isPending } = useLegalInfo();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Sanoat xavfsizligi ekspertiza xulosalarini ro‘yxatga olish" />
        <CardForm className="mt-4">
          <h2 className="font-medium mb-2">Arizachi to‘g‘risida ma’lumotlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tashkilot telefon raqami</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>
        <CardForm className="mt-4">
          <h2 className="font-medium mb-2">Buyurtmachi to‘g‘risida asosiy ma’lumotlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            <FormField
              name="customerTin"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tashkilot STIR</FormLabel>
                  <FormControl>
                    <Input maxLength={9} type="number" {...field} placeholder="Tashkilot STIR" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-[23px]">
              <Button
                onClick={() => {
                  mutateAsync({ tin: Number(form.watch('customerTin')) })
                    .then((data) => {
                      return data?.data?.data;
                    })
                    .then((data) => {
                      console.log(data?.districtId);
                      form.setValue('customerLegalName', data?.legalName);
                      form.setValue('customerLegalAddress', data?.legalAddress);
                      form.setValue('address', data?.address);
                      form.setValue('customerLegalForm', data?.legalForm);
                      form.setValue('customerPhoneNumber', '+' + data?.phoneNumber);
                      form.setValue('customerFullName', data?.fullName);
                      form.setValue('regionId', String(data?.regionId));
                      form.setValue('districtId', String(data?.districtId));
                      form.clearErrors();
                    });
                }}
                disabled={isPending || form.watch('customerTin')?.length !== 9}
                type="button"
              >
                Qidirsh
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <FormField
              name="customerLegalName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tashkilot nomi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tashkilot nomi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="customerLegalForm"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tashkilot tashkiliy-huquqiy shakli</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tashkilot tashkiliy-huquqiy shakli" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="customerLegalAddress"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tashkilot yuridik manzili</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tashkilot yuridik manzili" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="customerPhoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tashkilot telefon raqami (kodi bilan)</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="customerFullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tashkilot rahbarining F.I.Sh</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tashkilot rahbarining F.I.Sh" />
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
                  <FormLabel required>Obyekt joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue('districtId', '');
                      }}
                      value={String(field.value || '')}
                    >
                      <SelectTrigger>
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
                  <FormLabel required>Obyekt joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => field.onChange(v)}
                      value={String(field.value || '')}
                      disabled={!form.watch('regionId')}
                    >
                      <SelectTrigger>
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
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Obyekt joylashgan manzili</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Obyekt joylashgan manzili" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>
        <CardForm className="mt-4">
          <h2 className="font-medium mb-2">Murojaat to‘g‘risida ma’lumotlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <FormField
              control={form.control}
              name="monitoringLetterDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem>
                    <FormLabel required>Kuzatuv xati sanasi</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Kuzatuv xati sanasi"
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="monitoringLetterNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kuzatuv xati raqami</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Kuzatuv xati raqami" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submissionDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem>
                    <FormLabel required>Ekspertiza sanasi</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                    <FormDescription>Ekspertiza xulosasini hisobga olish uchun topshirgan sana</FormDescription>
                  </FormItem>
                );
              }}
            />
          </div>
        </CardForm>
        <CardForm className="mt-4">
          <h2 className="font-medium mb-2">Sanoat xavfsizligi ekspertiza xulosasi to‘g‘risida ma’lumotlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <FormField
              name="objectName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Ekspertiza ob’ekti nomi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ekspertiza ob’ekti nomi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="firstSymbolsGroup"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Birinchi belgilar guruhi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Birinchi belgilar guruhi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="secondSymbolsGroup"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Ikkinchi belgilar guruhi </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ikkinchi belgilar guruhi " />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="thirdSymbolsGroup"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Uchinchi belgilar guruhi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Uchinchi belgilar guruhi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
            <FormField
              name="expertiseConclusionNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Eksperiza xulosasi raqami</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Eksperiza xulosasi raqami" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="expertiseConclusionPath"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eksperiza xulosasi</FormLabel>
                  <FormControl>
                    <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardForm>
        <Button type="submit" className="mt-5">
          Ariza Yuborish
        </Button>
      </form>
    </Form>
  );
};
