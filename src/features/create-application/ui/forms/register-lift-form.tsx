import { useForm } from 'react-hook-form';
import { GoBack } from '@/shared/components/common';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { NoteForm } from '@/features/create-application';
import { Textarea } from '@/shared/components/ui/textarea';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { YandexMapModal } from '@/shared/components/common/yandex-map-modal';
import { InputFile } from '@/shared/components/common/file-upload/ui/file-upload';
import { CardForm } from '@/entities/create-application/ui/application-form-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import DatePicker from '@/shared/components/ui/datepicker.tsx';

export default () => {
  const form = useForm();
  const onSubmit = (data: any) => {
    console.log("Yuborilgan ma'lumot:", data);
  };

  const liftTypeOptions = getSelectOptions([]);

  const { handleSubmit } = form;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <GoBack title="Liftni ro'yxatga olish" />
        <NoteForm equipmentName="lift" />
        <CardForm className="mb-2">
          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
            <FormField
              control={form.control}
              name="crane_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lift turini tanlang</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Lift turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>{liftTypeOptions}</SelectContent>
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
                  <FormLabel>Liftning zavod raqami</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Liftning zavod raqami" {...field} />
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
              name="factoryNumber"
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
              name="productionDate"
              render={({ field }) => (
                <FormItem className="w-full 3xl:w-sm">
                  <FormLabel>Ishlab chiqarilgan sana</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} placeholder="Ishlab chiqarilgan sana" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loadCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yuk ko'tara olish</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Yuk ko'tara olish" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loadCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To'xtashlar soni</FormLabel>
                  <FormControl>
                    <Input
                      min={1}
                      type="number"
                      className="w-full 3xl:w-sm"
                      placeholder="To'xtashlar soni"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lift joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Lift joylashgan viloyat" />
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
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lift joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Lift joylashgan tuman" />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lift joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Lift joylashgan manzil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="geolocation"
              render={({ field }) => (
                <FormItem className="w-full 3xl:w-sm">
                  <FormLabel>Joylashuv</FormLabel>
                  <FormControl>
                    <YandexMapModal
                      initialCoords={field.value}
                      onConfirm={(coords) => field.onChange(coords)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="cranePhoto"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liftning birkasi bilan sur'ati</FormLabel>
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
                <FormLabel>Ариза баёни</FormLabel>
                <FormControl>
                  <Textarea rows={6} className="3xl:w-4/6" placeholder="Ариза баёни" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardForm>
        <CardForm className="grid grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-4">
          <FormField
            name="fileUrls"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sotib olish-sotish shartnomasi fayli</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fileUrls"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qurilma sertifikati fayli</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fileUrls"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                    Mas'ul shaxs tayinlanganligi to‘g‘risida buyruq fayli
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
            name="fileUrls"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ekspertiza loyihasi fayli</FormLabel>
                  <FormControl>
                    <InputFile form={form} {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fileUrls"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Montaj guvohnomasi fayli</FormLabel>
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
