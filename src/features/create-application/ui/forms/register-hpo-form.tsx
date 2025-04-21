import { useForm } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { InputFile } from '@/shared/components/common/file-upload';
import { HPOApplicationDTO } from '@/features/create-application/model/dto';
import YandexMapModal from '@/shared/components/common/yandex-map-modal/ui';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types';
import { CardForm } from '@/entities/user/applications/create-application/ui/application-form-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { applicationFormConstants } from '@/entities/create-application/model/form-constants';

export default () => {
  const form = useForm<HPOApplicationDTO>({});
  const onSubmit = (data: HPOApplicationDTO) => {
    console.log("Yuborilgan ma'lumot:", data);
  };

  const { spheres } = applicationFormConstants();

  const { handleSubmit, formState } = form;

  return (
    <Form {...form}>
      {JSON.stringify(formState)}
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <CardForm className="my-2">
          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-4/5 mb-5">
            <FormField
              control={form.control}
              name="upperOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yuqori tashkilotning nomi (mavjud bo‘lsa)</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Yuqori tashkilotning nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
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
              name="hazardousFacilityTypeId"
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
              name="spheres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarmoqlar</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-full 3xl:w-sm">
                        <SelectValue placeholder="Tarmoqlar" />
                      </SelectTrigger>
                      <SelectContent>
                        {spheres.map((item) => (
                          <SelectItem key={item.name} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              name="districtId"
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
                  <FormLabel>XICHO joylashgan manzil</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Alisher Navoiy ko‘chasi, 1-uy" {...field} />
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
                  <FormLabel>Joylashuv</FormLabel>
                  <FormControl>
                    <YandexMapModal
                      initialCoords={field.value ? [field.value] : null}
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
              name="extraArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full 3xl:w-sm">
                    XICHO sexlari, uchastkalari, maydonchalari va boshqa ishlab chiqarish obyektlarining nomi
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full 3xl:w-sm"
                      placeholder="XICHO sexlari, uchastkalari, maydonchalari va boshqa ishlab chiqarish obyektlarining nomi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-full 3xl:w-sm">
                    VM ning 2008 yil 10 dekabrdagi 271-son qaroriga muvofiq xavfli moddalarning nomi va miqdori
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full 3xl:w-sm"
                      placeholder="VM ning 2008 yil 10 dekabrdagi 271-son qaroriga muvofiq xavfli moddalarning nomi va miqdori"
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
            name="projectDocumentationPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Loyiha hujjatlari(PDF)
                  </FormLabel>
                  <FormControl>
                    <InputFile showPreview form={form} accept={[FileTypes.PDF]} {...field} />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insurancePolicyPath"
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
            name="appointmentOrderPath"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Ma'sul xodim tayinlanganligi buyrug‘i(PDF)</FormLabel>
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
            name="identificationCardPath"
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel required className="max-w-1/2 2xl:max-w-3/7">
                    Identifikatsiya varag‘i(PDF)
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
            name="expertOpinionPath"
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
            name="licensePath"
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
            name="ecologicalConclusionPath"
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
            name="permitPath"
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
            name="receiptPath"
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
            name="certificationPath"
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
            name="cadastralPassportPath"
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
            name="replyLetterPath"
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
            name="industrialSafetyDeclarationPath"
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
            name="deviceTestingPath"
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
          />
        </CardForm>
        <Button type="submit" className="mt-5">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  );
};
