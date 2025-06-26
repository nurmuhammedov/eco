import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { format, parseISO } from 'date-fns';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { Input } from '@/shared/components/ui/input.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { useSetFiles } from '@/features/inspections/hooks/use-set-files.ts';
import { useInspectionDetail } from '@/features/inspections/hooks/use-inspection-detail.ts';
import { useEffect } from 'react';

const schema = z.object({
  specialCode: z.string().optional().default(''),
  notificationLetterPath: z.string().optional().default(''),
  notificationLetterDate: z.date().optional().nullable().default(null),
  orderPath: z.string().optional().default(''),
  schedulePath: z.string().optional().default(''),
  programPath: z.string().optional().default(''),
  measuresPath: z.string().optional().default(''),
  resultPath: z.string().optional().default(''),
});

const AddInspectionDocuments = () => {
  const { mutate } = useSetFiles();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { data: inspectionData } = useInspectionDetail();

  useEffect(() => {
    if (inspectionData) {
      form.reset({
        specialCode: inspectionData?.specialCode,
        notificationLetterPath: inspectionData?.notificationLetterPath,
        programPath: inspectionData?.programPath,
        orderPath: inspectionData?.orderPath,
        schedulePath: inspectionData?.schedulePath,
        measuresPath: inspectionData?.measuresPath,
        resultPath: inspectionData?.resultPath,
      });
      if (inspectionData?.notificationLetterDate) {
        form.setValue('notificationLetterDate', new Date(inspectionData?.notificationLetterDate));
      }
    }
  }, [inspectionData]);

  const onSubmit = (data: any) => {
    const transformedDate = format(data.notificationLetterDate, 'yyyy-MM-dd') || null;

    mutate({
      ...data,
      notificationLetterDate: transformedDate,
    });
  };
  return (
    <Form {...form}>
      <form className="bg-white shadow rounded-lg p-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-4 gap-2  mb-4">
          <div>
            <FormField
              control={form.control}
              name="specialCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ombudsman maxsus kod</FormLabel>
                  <FormControl>
                    <Input placeholder="Ombudsman maxsus kod" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="notificationLetterDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem className="w-full ">
                    <FormLabel>Xabardor qilish xati sanasi</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Xabardor qilish xati sanasi"
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div>
            <FormField
              name="notificationLetterPath"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xabardor qilish xati</FormLabel>
                  <FormControl>
                    <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="schedulePath"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tekshiruv chora-tadbirlar rejasi</FormLabel>
                  <FormControl>
                    <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="programPath"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tekshirish dasturi</FormLabel>
                  <FormControl>
                    <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="resultPath"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tekshirish natijasi</FormLabel>
                  <FormControl>
                    <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="orderPath"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buyurtma</FormLabel>
                  <FormControl>
                    <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="measuresPath"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chora tadbirlar</FormLabel>
                  <FormControl>
                    <InputFile showPreview={true} form={form} name={field.name} accept={[FileTypes.PDF]} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button>Tekshirish hujjatlari yuklash</Button>
      </form>
    </Form>
  );
};

export default AddInspectionDocuments;
