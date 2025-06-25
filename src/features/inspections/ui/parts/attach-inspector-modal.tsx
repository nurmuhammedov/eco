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
import { useState } from 'react';
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { useAttachInspectors } from '@/features/inspections/hooks/use-attach-inspectors.ts';

const schema = z.object({
  startDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
  endDate: z.date({ message: FORM_ERROR_MESSAGES.required }),
  inspectorIdList: z.array(z.string()).min(1, FORM_ERROR_MESSAGES.required).default([]),
  path: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
});

const AttachInspectorModal = () => {
  const [isShow, setIsShow] = useState(false);
  const { mutateAsync, isPending } = useAttachInspectors();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { data: inspectorSelectData } = useInspectorSelect();

  function onSubmit(data: z.infer<typeof schema>) {
    mutateAsync({
      ...data,
      startDate: formatDate(data.startDate, 'yyyy-MM-dd'),
      endDate: formatDate(data.endDate, 'yyyy-MM-dd'),
    }).then(() => {
      setIsShow(false);
      form.reset();
    });
  }

  return (
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
              <div>
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                    return (
                      <FormItem className="w-full ">
                        <FormLabel required>Tekshiruv muddatini belgilash</FormLabel>
                        <DatePicker
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Ijro muddatini belgilash "
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                    return (
                      <FormItem className="w-full ">
                        <FormLabel required>Tugash muddatini belgilash</FormLabel>
                        <DatePicker
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Ijro muddatini belgilash "
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="inspectorIdList"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Ijrochini belgilash</FormLabel>
                      <FormControl>
                        <MultiSelect
                          {...field}
                          options={inspectorSelectData || []}
                          maxDisplayItems={5}
                          placeholder="Tekshiruvchi inspektorni belgilash"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="path"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Buyruq hujjatini yuklash</FormLabel>
                      <FormControl>
                        <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 ">
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                Buyruqni shakllantirish
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AttachInspectorModal;
