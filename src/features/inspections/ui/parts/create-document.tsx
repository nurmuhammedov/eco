import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { parseISO } from 'date-fns';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { Textarea } from '@/shared/components/ui/textarea.tsx';

const schema = z.object({
  date: z.date().nullable().default(null),
  descr: z.string().optional().default(''),
});

const CreateDocument = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form className="bg-white shadow rounded-lg p-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => {
              const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
              return (
                <FormItem className="w-[400px]">
                  <FormLabel>Kamchiliklarni bartaraf etish uchun so'ngi muddat</FormLabel>
                  <DatePicker
                    value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                    onChange={field.onChange}
                    placeholder="Kamchiliklarni bartaraf etish uchun so'ngi muddat"
                  />
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="descr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dalolatnoma xulosa qismi</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[150px] resize-none" placeholder="Dalolatnoma xulosa qismi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Dalolatnoma tuzish</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateDocument;
