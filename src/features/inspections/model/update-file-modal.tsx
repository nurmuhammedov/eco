// src/features/application/application-detail/ui/modals/update-file-modal.tsx

import { InputFile } from '@/shared/components/common/file-upload';
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
import { Form, FormField } from '@/shared/components/ui/form';
import { QK_INSPECTION } from '@/shared/constants/query-keys';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdateApplicationFile } from '../hooks/use-file-update';

const schema = z.object({
  filePath: z.string().min(1, 'Fayl yuklanishi shart'),
});

interface UpdateFileModalProps {
  inspectionId?: string;
}

export const UpdateFileModal: React.FC<UpdateFileModalProps> = ({ inspectionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateFile, isPending } = useUpdateApplicationFile();
  const queryClient = new QueryClient();
  const form = useForm<{ filePath: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: { filePath: string }) => {
    updateFile(
      {
        inspectionId,
        filePath: data.filePath,
      },
      {
        onSuccess: async () => {
          form.reset();
          setIsOpen(false);
          await queryClient.invalidateQueries({ queryKey: [QK_INSPECTION] });
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          Fayl yuklash
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Faylni yuklash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="filePath"
              control={form.control}
              render={({ field }) => (
                <InputFile
                  uploadEndpoint="/attachments/inspections"
                  form={form}
                  name={field.name}
                  onUploadComplete={(url) => {
                    form.setValue('filePath', url, { shouldValidate: true });
                  }}
                  buttonText="Yangi faylni tanlang"
                />
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="submit" loading={isPending}>
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
