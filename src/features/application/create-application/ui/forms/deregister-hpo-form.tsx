import { CardForm, DeRegisterHFDTO } from '@/entities/create-application';
import { useDeRegisterHFApplication } from '@/features/application/create-application/model/use-deregister-hpo-application.ts';
import { GoBack } from '@/shared/components/common';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { PhoneInput } from '@/shared/components/ui/phone-input';
import { Textarea } from '@/shared/components/ui/textarea';

interface DeRegisterHFFormProps {
  onSubmit: (data: DeRegisterHFDTO) => void;
}

export default ({ onSubmit }: DeRegisterHFFormProps) => {
  const { form } = useDeRegisterHFApplication();

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="XICHOni ro'yxatdan chiqarish" />
        <CardForm className="mb-2 mt-4">
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
              name="registryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Roʻyxatga olish raqami</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="XICHO roʻyxatga olish raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
            <FormField
              control={form.control}
              name="reasons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Sabab</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Sabab" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Belgisi</FormLabel>
                  <FormControl>
                    <Input className="w-full 3xl:w-sm" placeholder="Belgisi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-5/5 mb-5">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-12 w-full">
                  <FormLabel required>Roʻyxatdan chiqarish sababi</FormLabel>
                  <FormControl>
                    <Textarea className="w-full" rows={7} placeholder="Ariza bayoni" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <CardForm className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-4 mb-5">
          <FormField
            name="justifiedDocumentPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7" required>
                    XICHOni rekonstruksiya qilish yoki texnik jihatdan qayta jihozlashga loyiha hujjatlarining sanoat
                    xavfsizligi ekspertizasi xulosasi
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="filePath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="pb-4 border-b">
                <div className="flex items-end xl:items-center justify-between gap-2">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7" required>
                    Identifikatsiya varaqasini o‘z ichiga olgan XICHOni sanoat xavfsizligi ekspertizasi natijalari
                    to‘g‘risidagi xulosa nusxasi
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
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
