import { Button } from '@/shared/components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { Input } from '@/shared/components/ui/input.tsx';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { useUpdateRegisterFile } from '../hooks/use-file-edit';
import { QueryClient } from '@tanstack/react-query';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys';

const schema = z.object({
  documentNumber: z.string().min(1, 'Hujjat raqami majburiy'),
  documentDate: z.date({ required_error: 'Hujjat sanasi majburiy' }),
  expiryDate: z.date({ required_error: 'Amal qilish muddati majburiy' }),
});

type FormType = z.infer<typeof schema>;

const DocumentFormModal = ({ fieldName }: { fieldName: string }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const { mutate: updateFile, isPending } = useUpdateRegisterFile();
  const queryClient = new QueryClient();

  const onSubmit = (data: FormType) => {
    updateFile(
      {
        files: {
          [fieldName]: {
            number: data.documentNumber,
            documentDate: format(data.documentDate, 'yyyy-MM-dd'),
            expiryDate: format(data.expiryDate, 'yyyy-MM-dd'),
          },
        },
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Hujjat biriktirish</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Hujjat ma’lumotlari</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Hujjat raqami</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Masalan: 123-ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem>
                    <FormLabel required>Hujjat sanasi</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Sanani tanlang"
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                return (
                  <FormItem>
                    <FormLabel required>Amal qilish muddati</FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Muddati"
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button disabled={isPending} loading={isPending} type="submit" variant="success" className="w-full">
              Saqlash
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentFormModal;
