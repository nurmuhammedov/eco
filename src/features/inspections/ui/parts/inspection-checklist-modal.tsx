import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button.tsx';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog.tsx';
import { Input } from '@/shared/components/ui/input';
import { MultiSelect } from '@/shared/components/ui/multi-select.tsx';

import { useCustomSearchParams, useEIMZO } from '@/shared/hooks';
import { ApplicationModal } from '@/features/application/create-application';

const articleOptions = [
  { id: 'ARTICLE_55', name: '55-модда' },
  { id: 'ARTICLE_70', name: '70-модда' },
  { id: 'ARTICLE_97', name: '97-модда' },
  { id: 'ARTICLE_97_1', name: '97.1-модда' },
  { id: 'ARTICLE_98', name: '98-модда' },
];

const schema = z.object({
  articleList: z
    .array(z.string({ required_error: 'Majburiy maydon' }), { required_error: 'Majburiy maydon' })
    .min(1, 'Kamida bitta modda tanlang'),
  punishedEmployeeFullName: z.string({ required_error: 'Majburiy maydon' }).min(1, 'Majburiy maydon'),
  punishedEmployeePosition: z.string({ required_error: 'Majburiy maydon' }).min(1, 'Majburiy maydon'),

  users: z
    .array(
      z.object({
        fullName: z.string({ required_error: 'Majburiy maydon' }).min(1, 'Majburiy maydon'),
        position: z.string({ required_error: 'Majburiy maydon' }).min(1, 'Majburiy maydon'),
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
      articleList: [],
      punishedEmployeeFullName: '',
      punishedEmployeePosition: '',
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
      resultId,
      penalties: data.articleList,
      violator: {
        position: data.punishedEmployeePosition,
        fullName: data.punishedEmployeeFullName,
      },
      participants: data.users,
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
        open={modal === 'addUsers'}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Maʼlumotlarni to‘ldiring</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="border rounded-xl p-4 space-y-4 bg-slate-50">
                <h3 className="font-semibold">Ko‘rilgan choralar</h3>

                <FormField
                  control={form.control}
                  name="articleList"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Moddani tanlang</FormLabel>
                      <FormControl>
                        <MultiSelect
                          {...field}
                          options={articleOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Moddalarni tanlang"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="punishedEmployeeFullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Xodimning ismi</FormLabel>
                        <FormControl>
                          <Input placeholder="Ismini kiriting..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="punishedEmployeePosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Xodimning lavozimi</FormLabel>
                        <FormControl>
                          <Input placeholder="Lavozimini kiriting..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Qatnashuvchilar</h3>
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
                <Button type="button" onClick={() => append({ fullName: '', position: '' })}>
                  + Qatnashuvchi qo‘shish
                </Button>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    removeParams('modal');
                  }}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Saqlash
                </Button>
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
