import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { FC } from 'react';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { Button } from '@/shared/components/ui/button.tsx';
import { useAdd } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  paramValue: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
});

interface Props {
  id: any;
  closeModal: () => void;
  title?: string;
}

const FileUploadModal: FC<Props> = ({ id, closeModal, title = 'Xulosa faylini yuklash' }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const qc = useQueryClient();

  const { mutateAsync, isPending } = useAdd(`/conclusions/${id}/file`);

  const handleModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      closeModal();
      form.reset();
    }
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutateAsync({ filePath: data?.paramValue }).then(async () => {
      form.reset();
      closeModal();
      await qc.invalidateQueries({ queryKey: ['/conclusions'] });
    });
  };

  return (
    <Dialog onOpenChange={handleModalChange} open={!!id}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="paramValue"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fayl</FormLabel>
                  <FormControl>
                    <InputFile
                      buttonText="Faylni tanlang"
                      showPreview={true}
                      form={form}
                      uploadEndpoint="/attachments/conclusions"
                      name={field.name}
                      accept={[FileTypes.PDF]}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? 'Yuklanmoqda...' : 'Yuborish'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
