import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { DialogClose } from '@radix-ui/react-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatDate, parseISO } from 'date-fns';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select.tsx';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { useMemo, useState } from 'react';
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { getSelectOptions } from '@/shared/lib/get-select-options';
import { useCategoryTypeSelectQuery } from '@/entities/admin/inspection';
import { useEIMZO } from '@/shared/hooks';
import { ApplicationModal } from '@/features/application/create-application';
import { useSearchParams } from 'react-router-dom';

const schema = z.object({
  startDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
  endDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
  inspectorIdList: z.array(z.string()).min(1, FORM_ERROR_MESSAGES.required).default([]),
  checklistCategoryTypeId: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
});

const AttachInspectorModal = () => {
  const [isShow, setIsShow] = useState(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('inspectionId');

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { data: inspectorSelectData } = useInspectorSelect();
  const { data: categoryTypes } = useCategoryTypeSelectQuery();
  const categoryTypeOptions = useMemo(() => getSelectOptions(categoryTypes), [categoryTypes]);

  const {
    error,
    isLoading,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEIMZO({
    pdfEndpoint: '/inspections/decree/generate-pdf',
    submitEndpoint: '/inspections/decree',
    queryKey: 'inspections-attach-inspectors',
    successMessage: 'Muvaffaqiyatli saqlandi!',
    onSuccessNavigateTo: `/inspections?intervalId=${searchParams.get('intervalId') || ''}`,
  });

  function onSubmit(data: z.infer<typeof schema>) {
    handleCreateApplication({
      ...data,
      inspectionId: id,
      startDate: formatDate(data.startDate, 'yyyy-MM-dd'),
      endDate: formatDate(data.endDate, 'yyyy-MM-dd'),
    });
    setIsShow(false);
  }

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button size="sm">Inspektorni(larni) belgilash</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[730px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Inspektorni(larni) belgilash</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                    return (
                      <FormItem className="w-full ">
                        <FormLabel required>Tekshiruv boshlanish sanasi</FormLabel>
                        <DatePicker
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Boshlanish sanasini tanlang"
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                    return (
                      <FormItem className="w-full ">
                        <FormLabel required>Tekshiruv tugash sanasi</FormLabel>
                        <DatePicker
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Tugash sanasini tanlang"
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="inspectorIdList"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Inspektor(lar)ni tanlash</FormLabel>
                      <FormControl>
                        <MultiSelect
                          {...field}
                          options={inspectorSelectData || []}
                          maxDisplayItems={5}
                          placeholder="Tekshiruvchi inspektorlarni tanlang"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="checklistCategoryTypeId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tekshiruv turi</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tekshiruv turini tanlang" />
                          </SelectTrigger>
                          <SelectContent>{categoryTypeOptions}</SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-20">
                <DialogClose asChild>
                  <Button disabled={isLoading} variant="outline">
                    Bekor qilish
                  </Button>
                </DialogClose>
                <Button disabled={isLoading} type="submit">
                  Saqlash
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl || ''}
        isPdfLoading={isPdfLoading}
        onClose={() => {
          handleCloseModal();
          setIsShow(true);
        }}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  );
};

export default AttachInspectorModal;
