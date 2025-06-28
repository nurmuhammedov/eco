import { CardForm } from '@/entities/create-application';
import { ApplicationModal } from '@/features/application/create-application';
import { useCreateAccreditation } from '@/features/application/create-application/model/use-create-accreditation';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { MultiSelect } from '@/shared/components/ui/multi-select';

export default () => {
  const {
    form,
    onSubmit,
    isLoading,
    isModalOpen,
    documentUrl,
    isPdfLoading,
    handleCloseModal,
    submitApplicationMetaData,
    error,
    accreditationSphereOptions,
    t,
  } = useCreateAccreditation();

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardForm>
            <FormField
              name="accreditationSpheres"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('form.accreditationSpheres')}</FormLabel>
                  <FormControl>
                    <MultiSelect
                      {...field}
                      options={accreditationSphereOptions}
                      placeholder={t('select_accreditation_sphere')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardForm>

          <CardForm className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-4 my-5">
            <FormField
              name="accreditationFieldPath"
              control={form.control}
              render={({ field }) => (
                <FormItem className="pb-4 border-b">
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
                <FormItem className="pb-4 border-b">
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
                <FormItem className="pb-4 border-b">
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
                <FormItem className="pb-4 border-b">
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
                <FormItem className="pb-4 border-b">
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
                <FormItem className="pb-4 border-b">
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
                <FormItem className="pb-4 border-b">
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
                <FormItem className="pb-4 border-b">
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
                <FormItem className="pb-4 border-b">
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

          <Button type="submit" className="mt-5" disabled={!form.formState.isValid || isLoading}>
            Ariza Yuborish
          </Button>
        </form>
      </Form>
      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl!}
        onClose={handleCloseModal}
        isPdfLoading={isPdfLoading}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  );
};
