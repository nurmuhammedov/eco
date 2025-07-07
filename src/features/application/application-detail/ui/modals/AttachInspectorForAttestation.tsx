// /src/features/application/application-detail/ui/modals/AttachInspectorForAttestation.tsx

import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select.tsx';
import { ApplicationModal } from '@/features/application/create-application';
import { Button } from '@/shared/components/ui/button.tsx';
import DatePicker from '@/shared/components/ui/datepicker.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select.tsx';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys';
import { useEIMZO } from '@/shared/hooks';
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { formatDate, parseISO } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  deadline: z.date({ message: FORM_ERROR_MESSAGES.required }),
  inspectorId: z.string({ message: FORM_ERROR_MESSAGES.required }),
  resolution: z.string().optional().default(''),
});

const AttachInspectorForAttestationModal = () => {
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
    pdfEndpoint: '/appeals/attestation/reply/regional-accept/generate-pdf',
    submitEndpoint: '/appeals/attestation/reply/regional-accept',
    successMessage: 'Muvaffaqiyatli tasdiqlandi',
    queryKey: QK_APPLICATIONS,
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { data: inspectorSelectData } = useInspectorSelect();
  const inspectorOptions = getSelectOptions(inspectorSelectData || []);

  function onSubmit(data: z.infer<typeof schema>) {
    handleCreateApplication({
      ...data,
      deadline: formatDate(data.deadline, 'yyyy-MM-dd'),
      appealId: id,
    });
    setIsShow(false);
  }

  return (
    <>
      <Dialog onOpenChange={setIsShow} open={isShow}>
        <DialogTrigger asChild>
          <Button> Ijro etish</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-[#4E75FF]">Ijrochini belgilash</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => {
                  const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value;
                  return (
                    <FormItem className="w-full ">
                      <FormLabel required>Ijro muddatini belgilash </FormLabel>
                      <DatePicker
                        value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                        onChange={field.onChange}
                        placeholder="Ijro muddatini belgilash "
                      />
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="inspectorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Ijrochini belgilash</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Ijrochini belgilash" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>{inspectorOptions}</SelectContent>
                    </Select>
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
                        placeholder="Boshqarma boshlig‘i rezolyutsiyasi"
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

export default AttachInspectorForAttestationModal;
