import {
  ApplicationCategory,
  APPLICATIONS_DATA,
  CardForm,
  DeRegisterEquipmentDTO,
  MainApplicationCategory,
} from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { useDeRegisterEquipmentApplication } from '@/features/application/create-application/model/used-de-register-equipment'
import { PhoneInput } from '@/shared/components/ui/phone-input'

interface DeRegisterEquipmentFormProps {
  onSubmit: (data: DeRegisterEquipmentDTO) => void
}

export default ({ onSubmit }: DeRegisterEquipmentFormProps) => {
  const { form } = useDeRegisterEquipmentApplication()

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Qurilmani ro'yxatdan chiqarish" />
        <CardForm className="mt-4 mb-2">
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Qurilmalar</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Qurilma turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {APPLICATIONS_DATA?.filter(
                          (i) =>
                            i.category == ApplicationCategory.EQUIPMENTS &&
                            i.parentId == MainApplicationCategory.REGISTER
                        )?.map((option) => (
                          <SelectItem key={option.equipmentType || 'DEFAULT'} value={option.equipmentType || 'DEFAULT'}>
                            {option.name}
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
              name="registryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Qurilmaning roʻyxatga olish raqami</FormLabel>
                  <FormControl>
                    <Input className="3xl:w-sm w-full" placeholder="Qurilmaning roʻyxatga olish raqami" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="3xl:flex 3xl:flex-wrap 4xl:w-5/5 mb-5 gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-12 w-full">
                  <FormLabel>Qurilmani roʻyxatdan chiqarish sababi</FormLabel>
                  <FormControl>
                    <Textarea className="w-full" rows={7} placeholder="Ariza bayoni" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>
        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <FormField
            name="purchaseAgreementPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">Sotib olish-sotish shartnomasi fayli</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
          <FormField
            name="orderSuspensionPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                    Tashkilot faoliyati toʻxtatilganligi toʻgʻrisida buyruq
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
            name="laboratoryReportPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                    Qurilma ishlashdan chiqqanligini tasdiqlovchi laboratoriya bayonnomasini
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
            name="additionalInfoPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2 xl:items-center">
                  <FormLabel className="max-w-1/2 2xl:max-w-3/7">
                    Qurilmani yaroqsiz holga kelganligini tasdiqlovchi hujjat
                  </FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
        </CardForm>
        <Button type="submit" className="mt-5" disabled={!form.formState.isValid}>
          Ariza yaratish
        </Button>
      </form>
    </Form>
  )
}
