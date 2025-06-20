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
import { QK_APPLICATIONS } from '@/shared/constants/query-keys';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdateApplicationFile } from '../../hooks/mutations/use-update-file';

const schema = z.object({
  filePath: z.string().min(1, 'Fayl yuklanishi shart'),
});

interface UpdateFileModalProps {
  appealId?: string;
  fieldName: string;
}

export const UpdateFileModal: React.FC<UpdateFileModalProps> = ({ appealId, fieldName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateFile, isPending } = useUpdateApplicationFile();
  const queryClient = new QueryClient();
  const form = useForm<{ filePath: string }>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: { filePath: string }) => {
    updateFile(
      {
        appealId,
        fieldName,
        filePath: data.filePath,
      },
      {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Faylni yangilash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="filePath"
              control={form.control}
              render={({ field }) => (
                <InputFile
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
