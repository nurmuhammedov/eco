import { useForm } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { CardForm } from '@/entities/user/applications/create-application/ui/application-form-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { InputFile } from '@/shared/components/common/file-upload/ui';
import YandexMapModal from '@/shared/components/common/yandex-map-modal/ui';
import { CreateRegisterHpoDTO } from '@/entities/user/applications/create-application/model/application.dto';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-upload-types';

export default () => {
  const form = useForm<CreateRegisterHpoDTO>({});
  const onSubmit = (data: CreateRegisterHpoDTO) => {
    console.log("Yuborilgan ma'lumot:", data);
  };

  const { register, handleSubmit } = form;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <CardForm className="my-2">
          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
            <FormField
              control={form.control}
              name="parent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yuqori tashkilotning nomi (mavjud bo‘lsa)</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full 3xl:w-sm"
                      placeholder="Yuqori tashkilotning nomi"
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
                  <FormLabel>XICHO dan foydalanuvchi tashkilot nomi</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full 3xl:w-sm"
                      placeholder="XICHO dan foydalanuvchi tashkilot nomi"
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
                  <FormLabel>XICHO dan foydalanuvchi tashkilot pochta manzili</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full 3xl:w-sm"
                      placeholder="XICHO dan foydalanuvchi tashkilot pochta manzili"
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
                  <FormLabel>STIR</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full 3xl:w-sm"
                      placeholder="Soliq to‘lovchining identifikatsion raqami"
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
                  <FormLabel>XICHO ning nomi</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="XICHO ning nomi" {...field} />
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
                  <FormLabel>XICHO ning turi</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="XICHO ning turi" />
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
              name="networks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarmoqlar</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Tarmoqlar" />
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
                  <FormLabel>XICHO joylashgan viloyat</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="XICHO joylashgan viloyat" />
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
                  <FormLabel>XICHO joylashgan tuman</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="XICHO joylashgan tuman" />
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
                  <FormLabel>XICHO manzili</FormLabel>
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
              control={form.control}
              name="hpo_objects_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full 3xl:w-sm">
                    ХИЧО цехлари, участкалари, майдончалари ва бошқа ишлаб чиқариш объектларининг номи
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full 3xl:w-sm"
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
                  <FormLabel className="w-full 3xl:w-sm">
                    ВМнинг 2008 йил 10 декабрдаги 271-сон қарорига мувофиқ хавфли моддаларнинг номи ва миқдори
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full 3xl:w-sm"
                      placeholder="ВМнинг 2008 йил 10 декабрдаги 271-сон қарорига мувофиқ хавфли моддаларнинг номи ва миқдори"
                      {...field}
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
                <FormLabel>Ariza bayoni</FormLabel>
                <FormControl>
                  <Textarea rows={6} className="3xl:w-4/6" placeholder="Ariza bayoni" {...field} />
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Loyiha hujjatlari(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} accept={[FileTypes.PDF]} {...field} />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
          {/*<FormField
            control={form.control}
            name="fileUrls"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sug‘urta polisi(PDF)</FormLabel>
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Masʼul xodim tayinlanganligi buyrug‘i(PDF)</FormLabel>
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ekspertiza xulosasi(PDF)</FormLabel>
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Litsenziya(PDF)</FormLabel>
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ekologiya qo‘mitasidan xulosasi(PDF)</FormLabel>
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Identifikatsiya varag‘i(PDF)</FormLabel>
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ruxsatnoma(PDF)</FormLabel>
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
                    XICHOni ro‘yxatga olish uchun to‘lov kvitansiyasi(PDF)
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                    XICHO xodimlarning Sanoat xavfsizligi bo‘yicha attestatsiyadan o‘tganligi(PDF)
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">XICHO Kadastr pasporti(PDF)</FormLabel>
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Yong‘in xavfsizligi xulosasi(PDF)</FormLabel>
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sanoat xavfsizligi deklaratsiyasi(PDF)</FormLabel>
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
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Qurilmalarni sinovdan o‘tganligi(PDF)</FormLabel>
                  <FormControl>
                    <InputFile form={form} accept={[FileTypes.PDF]} {...field} />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />*/}
        </CardForm>
        <Button type="submit" className="mt-5">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  );
};
