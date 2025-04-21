import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Calendar } from '@/shared/components/ui/calendar';
import { DATE_FORMAT } from '@/shared/constants/date-formats';
import { getDisabledDates } from '@/shared/lib/get-disabled-dates';
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx';
import { InputFile } from '@/shared/components/common/file-upload/ui/file-upload.tsx';
import YandexMapModal from '@/shared/components/common/yandex-map-modal/ui';
import { CardForm } from '@/entities/user/applications/create-application/ui/application-form-card';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { CreateRegisterPressureVesselChemicalDTO } from '@/entities/user/applications/create-application/model/application.dto';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { CONTAINER_TYPES } from '@/entities/user/applications/create-application/data';

export default () => {
  const form = useForm<CreateRegisterPressureVesselChemicalDTO>({});
  const onSubmit = (data: CreateRegisterPressureVesselChemicalDTO) => {
    console.log("Yuborilgan ma'lumot:", data);
  };

  const containerTypeOptions = getSelectOptions(CONTAINER_TYPES);

  const { handleSubmit } = form;

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <CardForm className="my-2">
        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
          <FormField
            control={form.control}
            name="hpo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО ни танланг</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-full 3xl:w-sm">
                      <SelectValue placeholder="ХИЧО ни танланг" />
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
            name="crane_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Идиш турини танланг</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger className="w-full 3xl:w-sm">
                      <SelectValue placeholder="Идиш турини танланг" />
                    </SelectTrigger>
                    <SelectContent>{containerTypeOptions}</SelectContent>
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
                <FormLabel>Қурилманинг завод рақами</FormLabel>
                <FormControl>
                  <Input className="w-full 3xl:w-sm" placeholder="Қурилманинг завод рақами" {...field} />
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
                <FormLabel>Ишлаб чиқарган завод номи</FormLabel>
                <FormControl>
                  <Input className="w-full 3xl:w-sm" placeholder="Ишлаб чиқарган завод номи" {...field} />
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
                <FormLabel>Модель, марка</FormLabel>
                <FormControl>
                  <Input className="w-full 3xl:w-sm" placeholder="Модель, марка" {...field} />
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
                <FormLabel>Ишлаб чиқарилган сана</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left hover:text-neutral-350 font-normal',
                          !field.value && 'text-neutral-350',
                        )}
                      >
                        {field.value ? format(field.value, DATE_FORMAT) : <span>Ишлаб чиқарилган сана</span>}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => getDisabledDates(date, 'after')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boomLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full 3xl:w-sm">Ҳажми</FormLabel>
                <FormControl>
                  <Input min={1} type="number" className="w-full 3xl:w-sm" placeholder="Ҳажми" {...field} />
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
                <FormLabel>Мухит</FormLabel>
                <FormControl>
                  <Input min={1} type="number" className="w-full 3xl:w-sm" placeholder="Мухит" {...field} />
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
                <FormLabel>Рухсат этилган босим</FormLabel>
                <FormControl>
                  <Input
                    min={1}
                    type="number"
                    className="w-full 3xl:w-sm"
                    placeholder="Рухсат этилган босим"
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
                <FormLabel>Қурилма жойлашган вилоят</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-full 3xl:w-sm">
                      <SelectValue placeholder="Қурилма жойлашган вилоят" />
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
                <FormLabel>Қурилма жойлашган туман</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-full 3xl:w-sm">
                      <SelectValue placeholder="Қурилма жойлашган туман" />
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
                <FormLabel>Қурилма жойлашган манзил</FormLabel>
                <FormControl>
                  <Input className="w-full 3xl:w-sm" placeholder="Қурилма жойлашган манзил" {...field} />
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
                <FormLabel>Геолокация</FormLabel>
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
                <FormLabel>Идишнинг биркаси билан сурати</FormLabel>
                <FormControl>
                  <InputFile className="w-full 3xl:w-sm" form={form} accept={[FileTypes.PDF]} {...field} />
                </FormControl>
                <FormMessage className="text-right" />
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/7">Сотиб олиш-сотиш шартномаси файли</FormLabel>
                <FormControl>
                  <InputFile form={form} accept={[FileTypes.PDF]} {...field} />
                </FormControl>
              </div>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fileUrls"
          render={({ field }) => (
            <FormItem className="pb-4 border-b">
              <div className="flex items-end xl:items-center justify-between gap-2">
                <FormLabel className="max-w-1/2 2xl:max-w-3/7">Қурилма сертификати файли</FormLabel>
                <FormControl>
                  <InputFile form={form} accept={[FileTypes.PDF]} {...field} />
                </FormControl>
              </div>
              <FormMessage className="text-right" />
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
                  Масъул шахс тайинланганлиги тўғрисида буйруқ файли
                </FormLabel>
                <FormControl>
                  <InputFile form={form} accept={[FileTypes.PDF]} {...field} />
                </FormControl>
              </div>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fileUrls"
          render={({ field }) => (
            <FormItem className="pb-4 border-b">
              <div className="flex items-end xl:items-center justify-between gap-2">
                <FormLabel className="max-w-1/2 2xl:max-w-3/7">Экспертиза лойиҳаси файли</FormLabel>
                <FormControl>
                  <InputFile form={form} accept={[FileTypes.PDF]} {...field} />
                </FormControl>
              </div>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fileUrls"
          render={({ field }) => (
            <FormItem className="pb-4 border-b">
              <div className="flex items-end xl:items-center justify-between gap-2">
                <FormLabel className="max-w-1/2 2xl:max-w-3/7">Монтаж гувоҳномаси файли</FormLabel>
                <FormControl>
                  <InputFile form={form} accept={[FileTypes.PDF]} {...field} />
                </FormControl>
              </div>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fileUrls"
          render={({ field }) => (
            <FormItem className="pb-4 border-b">
              <div className="flex items-end xl:items-center justify-between gap-2">
                <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ариза файли</FormLabel>
                <FormControl>
                  <InputFile form={form} accept={[FileTypes.PDF]} {...field} />
                </FormControl>
              </div>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />
      </CardForm>
      <Button type="submit" className="mt-5">
        Ариза яратиш
      </Button>
    </form>
  );
};
