import { useConfirmDocument } from '@/features/application/application-detail/hooks/mutations/se-confirm-document';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'; // RadioGroup import qilindi
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

// Schema majburiy enum (string) qilib o'zgartirildi
const schema = z.object({
  shouldRegister: z.enum(['true', 'false'], {
    required_error: 'Iltimos, variantlardan birini tanlang.',
  }),
});

interface ConfirmWithRegistryModalProps {
  documentId: string;
}

const ConfirmWithRegistryModal: React.FC<ConfirmWithRegistryModalProps> = ({ documentId }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { id: appealId } = useParams<{ id: string }>();
  const { mutate: confirmDocument, isPending } = useConfirmDocument();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    // defaultValues olib tashlandi, shunda boshida hech qaysi tanlanmaydi
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    confirmDocument(
      {
        appealId,
        documentId,
        shouldRegister: data.shouldRegister === 'true', // string'ni boolenga o'tkazamiz
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          form.reset(); // Formani tozalash
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="success">Tasdiqlandi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reyestrga qo‘shilsinmi?</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="shouldRegister"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">Ha</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">Yo‘q</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Tasdiqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmWithRegistryModal;
