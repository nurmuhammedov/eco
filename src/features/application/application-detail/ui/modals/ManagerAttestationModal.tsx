// /src/features/application/application-detail/ui/modals/ManagerAttestationModal.tsx

import { ApplicationModal } from '@/features/application/create-application';
import { Button } from '@/shared/components/ui/button.tsx';
import DateTimePicker from '@/shared/components/ui/datetimepicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys';
import { useEIMZO } from '@/shared/hooks';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  dateOfAttestation: z.date({ message: FORM_ERROR_MESSAGES.required }),
  resolution: z.string().optional().default(''),
});

const ManagerAttestationModal = () => {
  const [isShow, setIsShow] = useState(false);
  const { id } = useParams();

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
    pdfEndpoint: '/appeals/attestation/reply/committee-accept/generate-pdf',
    submitEndpoint: '/appeals/attestation/reply/committee-accept',
    successMessage: 'Muvaffaqiyatli tasdiqlandi',
    queryKey: QK_APPLICATIONS,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    handleCreateApplication({
      ...data,
      dateOfAttestation: format(data.dateOfAttestation, "yyyy-MM-dd'T'HH:mm"),
      appealId: id,
    });
    setIsShow(false);
  }

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button>Ijro etish</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Attestatsiyani tasdiqlash</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="dateOfAttestation"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel required>Attestatsiyadan o'tish sanasi</FormLabel>
                    <DateTimePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rezolyutsiya</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        rows={7}
                        placeholder="Qo‘mita raisi rezolyutsiyasi"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3 ">
                <DialogClose asChild>
                  <Button disabled={isLoading} variant="outline">
                    Bekor qilish
                  </Button>
                </DialogClose>
                <Button disabled={isLoading} type="submit">
                  Tasdiqlash
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
        documentUrl={documentUrl!}
        onClose={() => {
          handleCloseModal();
          setIsShow(true);
        }}
        isPdfLoading={isPdfLoading}
        submitApplicationMetaData={submitApplicationMetaData}
      />
    </>
  );
};

export default ManagerAttestationModal;
