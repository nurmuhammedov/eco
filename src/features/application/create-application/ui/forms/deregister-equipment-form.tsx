import { CardForm, DeRegisterEquipmentDTO } from '@/entities/create-application'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { useDeRegisterEquipmentApplication } from '@/features/application/create-application/model/used-de-register-equipment'

interface DeRegisterEquipmentFormProps {
  onSubmit: (data: DeRegisterEquipmentDTO) => void
}

const fileFields = [
  {
    name: 'purchaseAgreementPath',
    label: 'Qurilmaning oldi sotdi shartnomasi',
  },
  {
    name: 'orderSuspensionPath',
    label: 'Tashkilot faoliyati toʻxtatilganligi toʻgʻrisida buyruq',
  },
  {
    name: 'laboratoryReportPath',
    label: 'Qurilma ishlashdan chiqqanligini tasdiqlovchi laboratoriya bayonnomasi',
  },
  {
    name: 'additionalInfoPath',
    label: 'Qurilmani yaroqsiz holga kelganligini tasdiqlovchi hujjat',
  },
] as const

export default ({ onSubmit }: DeRegisterEquipmentFormProps) => {
  const { form, equipmentOptions } = useDeRegisterEquipmentApplication()

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Qurilmani ro‘yxatdan chiqarish" />

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
                  <FormLabel required>Qurilma turi</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="3xl:w-sm w-full">
                        <SelectValue placeholder="Qurilma turini tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentOptions?.map((option) => (
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full w-full xl:col-span-3">
                  <FormLabel>Qurilmani roʻyxatdan chiqarish sababi</FormLabel>
                  <FormControl>
                    <Textarea className="w-full resize-none" rows={5} placeholder="Ariza bayoni..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <CardForm className="mb-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          {fileFields.map((fileField) => (
            <FormField
              key={fileField.name}
              name={fileField.name}
              control={form.control}
              render={({ field }) => (
                <FormItem className="border-b pb-4">
                  <div className="flex items-end justify-between gap-2 xl:items-center">
                    <FormLabel className="max-w-1/2 2xl:max-w-3/7">{fileField.label}</FormLabel>
                    <FormControl>
                      <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </CardForm>

        <Button type="submit" className="mt-5">
          Ariza yaratish
        </Button>
      </form>
    </Form>
  )
}
