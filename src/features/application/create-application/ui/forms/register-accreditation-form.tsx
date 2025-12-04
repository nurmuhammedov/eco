import { CardForm, CreateAccreditationDTO } from '@/entities/create-application'
import { useCreateAccreditation } from '@/features/application/create-application/model/use-create-accreditation'
import { GoBack } from '@/shared/components/common'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { MultiSelect } from '@/shared/components/ui/multi-select'

interface CreateAccreditationFormProps {
  onSubmit: (data: CreateAccreditationDTO) => void
}

export default ({ onSubmit }: CreateAccreditationFormProps) => {
  const { form, accreditationSphereOptions, t } = useCreateAccreditation()

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <GoBack title="Ekspert tashkilotini akkreditatsiyadan o'tkazish" />

        <CardForm className="mt-4">
          <FormField
            name="accreditationSpheres"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>{t('form.accreditationSpheres')}</FormLabel>
                <FormControl>
                  <MultiSelect
                    {...field}
                    maxDisplayItems={Infinity}
                    options={accreditationSphereOptions}
                    placeholder={t('select_accreditation_sphere')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
            <FormField
              control={form.control}
              name="responsiblePersonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Masʼul vakil F.I.Sh</FormLabel>
                  <FormControl>
                    <Input type="text" className="3xl:w-sm w-full" placeholder="Masʼul vakil F.I.Sh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardForm>

        <CardForm className="my-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 2xl:grid-cols-3">
          <FormField
            name="accreditationFieldPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2">
                  <FormLabel required>{t('form.accreditationFieldPath')}</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          {/* Qolgan fayl yuklash maydonlari shu yerga qo'shiladi */}
          <FormField
            name="organizationCharterPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2">
                  <FormLabel required>{t('form.organizationCharterPath')}</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="declarationConformityPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2">
                  <FormLabel required>{t('form.declarationConformityPath')}</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="receiptPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2">
                  <FormLabel required>{t('form.receiptPath')}</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="employeesInfoPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2">
                  <FormLabel required>{t('form.employeesInfoPath')}</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="accreditationResourcedPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2">
                  <FormLabel required>{t('form.accreditationResourcedPath')}</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="propertyOwnerShipPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2">
                  <FormLabel required>{t('form.propertyOwnerShipPath')}</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="qualityPerformanceInstructionPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2">
                  <FormLabel required>{t('form.qualityPerformanceInstructionPath')}</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="qualityManagementSystemPath"
            control={form.control}
            render={({ field }) => (
              <FormItem className="border-b pb-4">
                <div className="flex items-end justify-between gap-2">
                  <FormLabel required>{t('form.qualityManagementSystemPath')}</FormLabel>
                  <FormControl>
                    <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </CardForm>

        <Button type="submit" className="mt-5" disabled={!form.formState.isValid}>
          Ariza Yuborish
        </Button>
      </form>
    </Form>
  )
}
