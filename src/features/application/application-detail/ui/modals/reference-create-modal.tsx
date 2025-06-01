import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { DialogClose } from '@radix-ui/react-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { useState } from 'react';

const schema = z.object({
  descr: z.string(),
});

const ReferenceCreateModal = () => {
  const [isShow, setIsShow] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    console.log(data);
    setIsShow(false);
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button> Ijro etish</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Ma’lumotnoma/dalolatnoma tuzish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="descr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ma’lumotnoma / dalolatnoma xulosa qismi</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      rows={7}
                      placeholder="Ma’lumotnoma / dalolatnoma xulosa qismi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3 ">
              <DialogClose asChild>
                <Button variant="outline">Bekor qilish</Button>
              </DialogClose>
              <Button type="submit">Ma’lumotnoma/dalolatnoma tuzish</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReferenceCreateModal;
