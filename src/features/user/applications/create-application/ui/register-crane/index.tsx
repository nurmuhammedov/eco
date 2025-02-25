import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { useFetchHPOTypes } from '@/entities/user/applications/api';
import { InputFile } from '@/shared/components/common/file-upload/ui';
import YandexMapModal from '@/shared/components/common/yandex-map-modal/ui';
import { CardForm } from '@/entities/user/applications/ui/application-form-card';
import { CreateRegisterCraneDTO } from '@/entities/user/applications/model/application.types';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-upload-types';
import { useCreateRegisterHPOMutation } from '@/features/user/applications/create-application/models/register-hpo.mutations';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover.tsx';
import { cn } from '@/shared/lib/utils.ts';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/shared/components/ui/calendar.tsx';
import { DATE_FORMAT } from '@/shared/constants/date-formats.ts';

interface Props {
  form: UseFormReturn<CreateRegisterCraneDTO>;
}

export const RegisterCrane = ({ form }: Props) => {
  const { mutate, isPending } = useCreateRegisterHPOMutation();

  const onSubmit = (data: CreateRegisterCraneDTO) => {
    console.log("Yuborilgan ma'lumot:", data);

    mutate(data);
  };

  const { data: _HPOTypes } = useFetchHPOTypes();

  const {
    setValue,
    handleSubmit,
    formState: { isDirty, isValid },
  } = form;

  const canSubmit = [isDirty, isValid, !isPending].every(Boolean);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <CardForm className="my-2">
        <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
          <FormField
            control={form.control}
            name="hpo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО танланг</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-2xs 3xl:w-sm">
                      <SelectValue placeholder="ХИЧО танланг" />
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
                <FormLabel>Кран турини танланг</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-2xs 3xl:w-sm">
                      <SelectValue placeholder="Кран турини танланг" />
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
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Қурилманинг рўйхатга олиш рақами</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Қурилманинг рўйхатга олиш рақами"
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
                <FormLabel>Қурилманинг завод рақами</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Қурилманинг завод рақами"
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
                    <SelectTrigger className="w-2xs 3xl:w-sm">
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
                    <SelectTrigger className="w-2xs 3xl:w-sm">
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
                <FormLabel>Қурилма жойлашган манзил*</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Қурилма жойлашган манзил*"
                    {...field}
                  />
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
                    onConfirm={(coords) => {
                      setValue('geolocation', coords);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nextInspectionDate"
            render={({ field }) => (
              <FormItem className="w-full 3xl:w-sm">
                <FormLabel>Кейинги текшириш санаси</FormLabel>
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
                        {field.value ? (
                          format(field.value, DATE_FORMAT)
                        ) : (
                          <span>Кейинги текшириш санаси</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
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
            name="nextInspectionDate"
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
                        {field.value ? (
                          format(field.value, DATE_FORMAT)
                        ) : (
                          <span>Ишлаб чиқарилган сана</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
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
                <FormLabel className="w-2xs 3xl:w-sm">
                  Стреласининг узинлиги
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Стреласининг узинлиги"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loadCapacity"
            render={({ field }) => (
              <FormItem className="w-2xs 3xl:w-xl">
                <FormLabel>Юк кўтара олиш</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Юк кўтара олиш"
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
                <FormLabel>Краннинг биркаси билан сурати</FormLabel>
                <FormControl>
                  <InputFile
                    className="w-2xs 3xl:w-sm"
                    form={form}
                    accept={[FileTypes.PDF]}
                    {...field}
                  />
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
                <Textarea
                  rows={6}
                  className="3xl:w-4/6"
                  placeholder="Ариза баёни"
                  {...field}
                />
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Лойиҳа ҳужжатлари
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Суғурта полиси
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Масъул ходим тайинланганлиги буйруғи
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Экспертиза хулосаси
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Лицензия
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Экология қўмитасидан хулосаси*
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Идентификация варағи
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Рухсатнома
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл ХИЧОни рўйхатга олиш учун тўлов квитанцияси
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл ХИЧО ходимларнинг Саноат хавфсизлиги бўйича аттестациядан
                  ўтганлиги
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл ХИЧО Кадастр паспорти
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Ёнғин хавфсизлиги хулосаси
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Саноат хавфсизлиги Декларацияси
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
                <FormLabel className="max-w-1/2 2xl:max-w-3/5">
                  Файл Қурилмаларни синовдан ўтганлиги
                </FormLabel>
                <FormControl>
                  <InputFile form={form} accept={[FileTypes.PDF]} {...field} />
                </FormControl>
              </div>
              <FormMessage className="text-right" />
            </FormItem>
          )}
        />
      </CardForm>
      <Button type="submit" className="bg-blue-400 mt-5" disabled={!canSubmit}>
        Ариза яратиш
      </Button>
    </form>
  );
};
