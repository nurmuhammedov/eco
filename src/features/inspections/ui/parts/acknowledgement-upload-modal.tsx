import { useState, ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, UploadCloud } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/shared/components/ui/form';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types';
import { useAdd } from '@/shared/hooks';

const schema = z.object({
  acknowledgementPath: z.string({ required_error: 'Fayl yuklanishi shart' }).min(1, 'Fayl yuklanishi shart'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  resultId: string;
  acknowledgementPath?: string | null;
  onClose?: () => void;
  trigger?: ReactNode;
}

const AcknowledgementUploadModal = ({ resultId, acknowledgementPath, onClose, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { mutateAsync: uploadAck, isPending } = useAdd(
    '/inspection-results/acknowledgement',
    'Tilxat muvaffaqiyatli saqlandi!',
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      acknowledgementPath: acknowledgementPath || '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ acknowledgementPath: acknowledgementPath || '' });
    }
  }, [open, acknowledgementPath, form]);

  const onSubmit = (values: FormValues) => {
    if (!resultId) return;
    uploadAck({
      inspectionResultId: resultId,
      acknowledgementPath: values.acknowledgementPath,
    }).then(() => {
      toast.success('Tilxat muvaffaqiyatli saqlandi!', { richColors: true });
      qc.invalidateQueries({ queryKey: ['/inspection-results'] }).then((r) => console.log(r));
      setOpen(false);
      onClose?.();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <UploadCloud className="mr-2 h-4 w-4" /> Tilxat yuklash
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tilxat faylini yuklash</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
            <FormField
              control={form.control}
              name="acknowledgementPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tilxat (PDF)</FormLabel>
                  <InputFile
                    uploadEndpoint="/attachments/inspections"
                    form={form}
                    name={field.name}
                    accept={[FileTypes.PDF]}
                    buttonText={field.value ? 'Faylni almashtirish' : 'Faylni tanlash'}
                    onUploadComplete={(url) => {
                      field.onChange(url);
                    }}
                  />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AcknowledgementUploadModal;
