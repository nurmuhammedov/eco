import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { DialogClose } from '@radix-ui/react-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { parseISO } from 'date-fns';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { useState } from 'react';

import { Textarea } from '@/shared/components/ui/textarea.tsx';

const schema = z.object({
  deadline: z.date({ message: FORM_ERROR_MESSAGES.required }),
  reportMsg: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
});

const AddReportForm = () => {
  const [isShow, setIsShow] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    console.log(data);
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button size="sm">ADD REPORT</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">ADD REPORT</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-2 mb-2">
              <div>
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                    return (
                      <FormItem className="w-full ">
                        <FormLabel required>DEADLINE</FormLabel>
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
                  name="reportMsg"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>REPORT DESCRIPTION</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[150px] resize-none" {...field}></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 ">
              <DialogClose asChild>
                <Button variant="outline">CANCEL</Button>
              </DialogClose>
              <Button type="submit">ADD REPORT</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReportForm;
