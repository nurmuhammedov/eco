import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { CardForm } from '@/entities/user/applications/ui/application-form-card';
import { CreateRegisterHpoDTO } from '@/entities/user/applications/model/application.types';
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
import { useFetchHPOTypes } from '@/entities/user/applications/api';
import { InputFile } from '@/shared/components/common/file-upload/ui';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-upload-types';
import { useCreateRegisterHPOMutation } from '@/features/user/applications/create-application/models/register-hpo.mutations';
import YandexMapModal from '@/shared/components/common/yandex-map-modal/ui';

interface Props {
  form: UseFormReturn<CreateRegisterHpoDTO>;
}

export const RegisterHPOForm = ({ form }: Props) => {
  const { mutate, isPending } = useCreateRegisterHPOMutation();

  const onSubmit = (data: CreateRegisterHpoDTO) => {
    console.log("Yuborilgan ma'lumot:", data);

    mutate(data);
  };

  const { data: _HPOTypes } = useFetchHPOTypes();

  const {
    register,
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
            name="parent_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Юқори ташкилотнинг номи (мавжуд бўлса)</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Юқори ташкилотнинг номи"
                    {...register('parent_name')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organization_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО дан фойдаланувчи ташкилот номи</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Юқори ташкилотнинг номи"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organization_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  ХИЧО дан фойдаланувчи ташкилот почта манзили
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ХИЧОдан фойдаланувчи ташкилот почта манзили"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>СТИР</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="Солиқ тўловчининг идентификацион рақами"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hpo_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО нинг номи</FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ХИЧО нинг номи"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hpo_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО нинг тури</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-2xs 3xl:w-sm">
                      <SelectValue placeholder="Ариза тури" />
                    </SelectTrigger>
                    <SelectContent>
                      {/*{Object.values(ApplicationType).map((type) => (*/}
                      {/*  <SelectItem value={type}>{type}</SelectItem>*/}
                      {/*))}*/}
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
            name="hpo_objects_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-2xs 3xl:w-sm">
                  ХИЧО цехлари, участкалари, майдончалари ва бошқа ишлаб чиқариш
                  объектларининг номи
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ХИЧО цехлари, участкалари, майдончалари ва бошқа ишлаб чиқариш объектларининг номи"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hazardous_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-2xs 3xl:w-sm">
                  ВМнинг 2008 йил 10 декабрдаги 271-сон қарорига мувофиқ хавфли
                  моддаларнинг номи ва миқдори
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-2xs 3xl:w-sm"
                    placeholder="ВМнинг 2008 йил 10 декабрдаги 271-сон қарорига мувофиқ хавфли моддаларнинг номи ва миқдори"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="networks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тармоқлар</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-2xs 3xl:w-sm">
                      <SelectValue placeholder="Тармоқлар" />
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
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ХИЧО вилояти</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-2xs 3xl:w-sm">
                      <SelectValue placeholder="ХИЧО вилояти" />
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
                <FormLabel>ХИЧО тумани</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-2xs 3xl:w-sm">
                      <SelectValue placeholder="ХИЧО тумани" />
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
              <FormItem className="w-full 3xl:w-sm">
                <FormLabel>ХИЧО манзили</FormLabel>
                <FormControl>
                  <YandexMapModal
                    initialCoords={field.value}
                    onConfirm={(coords) => {
                      setValue('address', coords);
                    }}
                  />
                </FormControl>
                <FormMessage />
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
