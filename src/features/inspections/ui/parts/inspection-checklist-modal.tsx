import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button.tsx';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx';
import { Input } from '@/shared/components/ui/input';
import { useCustomSearchParams, useEIMZO } from '@/shared/hooks';
import { ApplicationModal } from '@/features/application/create-application';

const schema = z.object({
  users: z
    .array(
      z.object({
        fullName: z.string().min(1, ''),
        position: z.string().min(1, ''),
      }),
    )
    .min(1, 'Kamida bitta foydalanuvchi qo‘shilishi kerak'),
});

type FormValues = z.infer<typeof schema>;

const AttachInspectorModal = ({ items = [], resultId }: any) => {
  const {
    addParams,
    removeParams,
    paramsObject: { modal = '' },
  } = useCustomSearchParams();

  const {
    error,
    isLoading,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEIMZO({
    pdfEndpoint: '/inspection-results/act/generate-pdf',
    submitEndpoint: '/inspection-results/act',
    queryKey: '/inspection-results',
    successMessage: 'Muvaffaqiyatli saqlandi!',
    onEnd: () => {
      removeParams('modal');
      form.reset();
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      users: [{ fullName: '', position: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'users',
  });

  const onSubmit = (data: FormValues) => {
    handleCreateApplication({
      dtoList: items,
      resultId: resultId,
      participants: data?.users,
    });
  };

  return (
    <>
      <Dialog
        onOpenChange={(val) => {
          form.reset();
          if (val) {
            addParams({ modal: 'addUsers' });
          } else {
            removeParams('modal');
          }
        }}
        open={modal == 'addUsers'}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Qatnashuvchilarni qo‘shish</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`users.${index}.fullName`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel required>Ismi</FormLabel>
                        <FormControl>
                          <Input placeholder="Ismini kiriting..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`users.${index}.position`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel required>Lavozimi</FormLabel>
                        <FormControl>
                          <Input placeholder="Lavozimini kiriting..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {fields.length > 1 && (
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                      O‘chirish
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <Button type="button" onClick={() => append({ fullName: '', position: '' })}>
                  Qo‘shish
                </Button>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button onClick={() => form.reset()} variant="outline">
                  Bekor qilish
                </Button>
                <Button type="submit">Saqlash</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl || ''}
        isPdfLoading={isPdfLoading}
        onClose={() => {
          handleCloseModal();
        }}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  );
};

export default AttachInspectorModal;
