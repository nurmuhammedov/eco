import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { FC } from 'react';
import { Input } from '@/shared/components/ui/input.tsx';
import { useCustomSearchParams, useEIMZO } from '@/shared/hooks';
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts';
import { ApplicationModal } from '@/features/application/create-application';

const schema = z.object({
  objects: z.string().min(5).default(''),
  districtName: z.string().min(5).default(''),
  sectionFirst: z.string().min(5).default(''),
  sectionSecond: z.string().min(5).default(''),
  sectionFourth: z.string().min(5).default(''),
  sectionFifth: z.string().min(5).default(''),
  sectionSixth: z.string().min(5).default(''),
});

const CreateDocument: FC<{ resetTab: () => void }> = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { paramsObject } = useCustomSearchParams();
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
    pdfEndpoint: '/inspections/act/generate-pdf',
    submitEndpoint: '/inspections/act',
    successMessage: 'Success',
    queryKey: QK_INSPECTION,
  });

  function onSubmit(data: z.infer<typeof schema>) {
    handleCreateApplication({ ...data, inspectionId: paramsObject?.inspectionId });
  }

  return (
    <Form {...form}>
      <form className="bg-white shadow rounded-lg p-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormField
                control={form.control}
                name="districtName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuman </FormLabel>
                    <FormControl>
                      <Input placeholder="Tuman " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormField
                control={form.control}
                name="objects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tekshirilgan obyektlar nomlari</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[120px] resize-none"
                        placeholder="Tekshirilgan obyektlar nomlari"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="sectionFirst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1-Bo'lim</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px] resize-none" placeholder="1-Bo'lim" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="sectionSecond"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2-Bo'lim</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px] resize-none" placeholder="2-Bo'lim" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="sectionFourth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xulosa </FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px] resize-none" placeholder="Xulosa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="sectionFifth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ko'rilgan choralar</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px] resize-none" placeholder="Ko'rilgan choralar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="sectionSixth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Takliflar</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px] resize-none" placeholder="Takliflar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button>Dalolatnoma tuzish</Button>
        </div>
      </form>
      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl!}
        onClose={() => {
          handleCloseModal();
        }}
        isPdfLoading={isPdfLoading}
        submitApplicationMetaData={submitApplicationMetaData}
        title="Created document"
      />
    </Form>
  );
};

export default CreateDocument;
