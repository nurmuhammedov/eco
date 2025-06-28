import { CardForm } from '@/entities/create-application';
import { ApplicationModal } from '@/features/application/create-application';
import { useReRegisterAccreditation } from '@/features/application/create-application/model/use-re-register-accreditation';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { Button } from '@/shared/components/ui/button';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input.tsx';
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx';

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
  } = useReRegisterAccreditation();

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
                  <FormLabel required>Akkreditatsiya sohasi</FormLabel>
                  <FormControl>
                    <MultiSelect
                      {...field}
                      options={accreditationSphereOptions}
                      placeholder="Akkreditatsiya sohasini tanlang..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                name="certificateIssueDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>ЭТ attestat berilgan sana</FormLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="certificateEndDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Akkreditatsiya attestatining amal qilish muddati</FormLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="certificateNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Akkreditatsiya attestatining ro‘yxat raqami</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ro‘yxat raqami" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardForm>

          <CardForm className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-4 my-5">
            <FormField
              name="accreditationFieldPath"
              control={form.control}
              render={() => (
                <FormItem className="pb-4 border-b">
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel required>Buyurtmachi faoliyat olib bormoqchi bo‘lgan akkreditatsiya sohasi</FormLabel>
                    <FormControl>
                      <InputFile form={form} name="accreditationFieldPath" accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="organizationCharterPath"
              control={form.control}
              render={() => (
                <FormItem className="pb-4 border-b">
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel required>
                      Buyurtmachi tomonidan akkreditatsiya qilish uchun to‘lov to‘langanligini tasdiqlovchi hujjat
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name="organizationCharterPath" accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="declarationConformityPath"
              control={form.control}
              render={() => (
                <FormItem className="pb-4 border-b">
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel required>
                      Mavjud bino va inshootlar, jihozlar, asbob-uskunalar buyurtmachiga mulk huquqi yoki boshqa qonuniy
                      asosda taalluqliligini tasdiqlovchi hujjatlarning nusxalari
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name="declarationConformityPath" accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="receiptPath"
              control={form.control}
              render={() => (
                <FormItem className="pb-4 border-b">
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel required>Ekspert tashkiloti nizomi</FormLabel>
                    <FormControl>
                      <InputFile form={form} name="receiptPath" accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="employeesInfoPath"
              control={form.control}
              render={() => (
                <FormItem className="pb-4 border-b">
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel required>
                      Akkreditasiya sohasidagi ishlarni bajaradigan hodimlar to‘g‘risidagi maʼlumotlar
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name="employeesInfoPath" accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="propertyOwnerShipPath"
              control={form.control}
              render={() => (
                <FormItem className="pb-4 border-b">
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel required>Buyurtmachining sifat bo‘yicha va faoliyati bo‘yicha qo‘llanmasi</FormLabel>
                    <FormControl>
                      <InputFile form={form} name="propertyOwnerShipPath" accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="qualityPerformanceInstructionPath"
              control={form.control}
              render={() => (
                <FormItem className="pb-4 border-b">
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel required>
                      Buyurtmachining akkreditatsiya mezonlariga muvofiqligini tasdiqlovchi deklaratsiya
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name="qualityPerformanceInstructionPath" accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="accreditationResourcedPath"
              control={form.control}
              render={() => (
                <FormItem className="pb-4 border-b">
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel required>
                      Akkreditasiya sohasidagi ishlarni bajarish uchun mavjud sharoitlar, jihozlar, dasturlar va
                      asbob-uskunalar xaqidagi ma'lumotlar
                    </FormLabel>
                    <FormControl>
                      <InputFile form={form} name="accreditationResourcedPath" accept={[FileTypes.PDF]} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="qualityManagementSystemPath"
              control={form.control}
              render={() => (
                <FormItem className="pb-4 border-b">
                  <div className="flex items-end justify-between gap-2">
                    <FormLabel required>Buyurtmachining sifatni boshqarish tizimi xujjatlari</FormLabel>
                    <FormControl>
                      <InputFile form={form} name="qualityManagementSystemPath" accept={[FileTypes.PDF]} />
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
