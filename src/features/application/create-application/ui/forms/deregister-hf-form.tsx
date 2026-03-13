import { CardForm, DeRegisterHFDTO } from '@/entities/create-application'
import { useDeRegisterHFApplication } from '@/features/application/create-application/model/use-deregister-hf-application.ts'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Textarea } from '@/shared/components/ui/textarea'

interface DeRegisterHFFormProps {
  onSubmit: (data: DeRegisterHFDTO) => void
}

export default ({ onSubmit }: DeRegisterHFFormProps) => {
  const { form } = useDeRegisterHFApplication()

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="XICHOni ro‘yxatdan chiqarish" />
        <CardForm className="mt-4 mb-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Telefon raqami</FormLabel>
                  <FormControl>
                    <PhoneInput className="3xl:w-sm w-full" placeholder="+998 XX XXX XX XX" {...field} />
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
                    <Input className="3xl:w-sm w-full" placeholder="XICHO roʻyxatga olish raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="sign"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Belgisi</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input className="3xl:w-sm w-full" placeholder="Belgisi" {...field} />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}
          </div>

          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField
              control={form.control}
              name="reasons"
              render={({ field }) => (
                <FormItem className="col-span-12 w-full">
                  <FormLabel required>Reyestrdan chiqarish sababi</FormLabel>
                  <FormControl>
                    <Textarea className="w-full" rows={7} placeholder="Sababni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <FormField
            name="justifiedDocumentPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <FormLabel className="w-full sm:max-w-1/2 2xl:max-w-3/7" required>
                    XICHOni Reyestrdan chiqarish uchun asos bo‘luvchi hujjat nusxasi (muassisning, O‘zbekiston
                    Respublikasi Prezidentining yoki O‘zbekiston Respublikasi Hukumatining, sudning qarori, oldi-sotdi
                    shartnomasi)
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="handoverActPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <FormLabel className="w-full sm:max-w-1/2 2xl:max-w-3/7" required>
                    Mulkni topshirish va qabul qilish dalolatnomasining nusxasi
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </CardForm>
        <Button type="submit" className="mt-0">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  )
}
