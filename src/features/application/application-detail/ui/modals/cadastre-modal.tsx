import { ApplicationModal } from '@/features/application/create-application';
import { Button } from '@/shared/components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { useEIMZO } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  conclusion: z.string(),
});

const schema2 = z.object({
  registryNumber: z.string(),
});

const RejectApplicationModal = ({ url = 'cadastre-passport' }: any) => {
  const [isShow, setIsShow] = useState(false);

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
    pdfEndpoint: `/appeals/${url}/confirmation/generate-pdf`,
    submitEndpoint: `/appeals/${url}/confirmation`,
    successMessage: 'Ariza muvaffaqiyatli tasdiqlandi!',
    queryKey: QK_APPLICATIONS,
  });

  const {
    error: rejectError,
    isLoading: isRejectLoading,
    documentUrl: rejectDocumentUrl,
    isModalOpen: isRejectModalOpen,
    isPdfLoading: rejectPdfLoading,
    handleCloseModal: rejectCloseModal,
    handleCreateApplication: rejectCreateApplication,
    submitApplicationMetaData: rejectSubmitApplicationMetaData,
  } = useEIMZO({
    pdfEndpoint: `/appeals/${url}/rejection/generate-pdf`,
    submitEndpoint: `/appeals/${url}/rejection`,
    successMessage: 'Ariza muvaffaqiyatli qaytarildi!',
    queryKey: QK_APPLICATIONS,
  });

  const form = useForm<z.infer<typeof schema2>>({
    resolver: zodResolver(schema2),
  });

  const rejectForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { id } = useParams();

  function onSubmit(data: z.infer<typeof schema2>) {
    handleCreateApplication({ ...data, appealId: id });
    setIsShow(false);
  }

  function onRejectSubmit(data: z.infer<typeof schema>) {
    rejectCreateApplication({ ...data, appealId: id });
    setIsShow(false);
  }

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button>Arizani ijro etish</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Arizani ijro etish</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="confirm">
            <TabsList className="bg-[#EDEEEE]">
              <TabsTrigger value="confirm">Tasdiqlash</TabsTrigger>
              <TabsTrigger value="reject">Arizani rad etish</TabsTrigger>
            </TabsList>
            <TabsContent value="confirm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="registryNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reyestr raqami</FormLabel>
                        <FormControl>
                          <Input className="resize-none" placeholder="Reyestr raqamini kiriting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3 mt-35">
                    <DialogClose asChild>
                      <Button variant="outline">Bekor qilish</Button>
                    </DialogClose>
                    <Button type="submit">Arizani tasdiqlash</Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="reject">
              <Form {...rejectForm}>
                <form onSubmit={rejectForm.handleSubmit(onRejectSubmit)} className="space-y-4">
                  <FormField
                    control={rejectForm.control}
                    name="conclusion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rad etish sababi</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            rows={7}
                            placeholder="Qaytarish sababini kiriting"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <DialogClose asChild>
                      <Button variant="outline">Bekor qilish</Button>
                    </DialogClose>
                    <Button variant="destructive" type="submit">
                      Arizani rad etish
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <ApplicationModal
        error={error}
        isOpen={isModalOpen}
        isLoading={isLoading}
        documentUrl={documentUrl!}
        onClose={() => {
          handleCloseModal();
          setIsShow(true);
        }}
        isPdfLoading={isPdfLoading}
        submitApplicationMetaData={submitApplicationMetaData}
      />
      <ApplicationModal
        error={rejectError}
        isOpen={isRejectModalOpen}
        isLoading={isRejectLoading}
        documentUrl={rejectDocumentUrl!}
        onClose={() => {
          rejectCloseModal();
          setIsShow(true);
        }}
        isPdfLoading={rejectPdfLoading}
        submitApplicationMetaData={rejectSubmitApplicationMetaData}
      />
    </>
  );
};

export default RejectApplicationModal;
