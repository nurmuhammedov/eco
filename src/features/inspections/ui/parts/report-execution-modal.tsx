import { Dialog, DialogContent } from '@/shared/components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { FC } from 'react';
import { InputFile } from '@/shared/components/common/file-upload';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { Button } from '@/shared/components/ui/button.tsx';
import { CircleAlert, SendHorizontal } from 'lucide-react';
import { useExecutionList } from '@/features/inspections/hooks/use-execution-list.ts';
import { useAddFileToExecution } from '@/features/inspections/hooks/use-add-file-to-execution.ts';
import FileLink from '@/shared/components/common/file-link.tsx';
import { getDate } from '@/shared/utils/date.ts';
import { Badge } from '@/shared/components/ui/badge.tsx';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover.tsx';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { useAcceptExecutionReport } from '@/features/inspections/hooks/use-accept-execution-report.ts';
import { useRejectExecutionReport } from '@/features/inspections/hooks/use-reject-execution-report.ts';
import { toast } from 'sonner';

export const executionReportStatuses = new Map([
  ['ACCEPTED', { label: 'Qabul qilindi', variant: 'success' }],
  ['REJECTED', { label: 'Rad etildi', variant: 'error' }],
  ['UPLOADED', { label: 'Fayl yuklangan', variant: 'warning' }],
] as const);

const schema = z.object({
  paramValue: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
});

interface Props {
  id: any;
  description: string;
  closeModal: () => void;
}

const RejectExecution: FC<{ id: any }> = ({ id }) => {
  const { mutate: rejectReport } = useRejectExecutionReport();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    rejectReport({ id, data });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" variant="destructive">
          Rad etish
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form className="max-w-[400px]" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="paramValue"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Javob xati</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="resize-none min-h-[100px]" placeholder="Tafsilotlar"></Textarea>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="w-full mt-2" size="sm">
              Yuborish
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

const ReportExecutionModal: FC<Props> = ({ id, closeModal, description }) => {
  const { user } = useAuth();
  const handleModal = (isOpen: boolean) => {
    if (!isOpen) {
      closeModal();
    }
  };
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { data = [], isLoading } = useExecutionList(id);
  const { mutateAsync, isPending } = useAddFileToExecution(id);
  const { mutateAsync: acceptReport } = useAcceptExecutionReport();

  function onSubmit(data: z.infer<typeof schema>) {
    mutateAsync(data).then(() => form.reset({ paramValue: undefined }));
  }

  const isFormShow =
    (data?.length === 0 || (data?.length !== 0 && data[data?.length - 1]?.status === 'REJECTED')) &&
    user?.role === UserRoles.LEGAL;
  return (
    <Dialog onOpenChange={handleModal} open={!!id}>
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-y-auto">
        <div>
          <h2 className="font-medium mb-1">Aniqlangan kamchilik</h2>
          <p className="text-sm">{description}</p>
        </div>
        <hr className="border-neutral-50" />
        {isLoading ? (
          <div className="font-medium my-6 text-center">Yuklanmoqda...</div>
        ) : (
          <>
            <div>
              {data?.map((item: any) => {
                const currentBadge = executionReportStatuses.get(item?.status || 'UPLOADED');

                return (
                  <div className="grid grid-cols-4 gap-2 odd:bg-neutral-50 rounded p-2.5 items-center">
                    <div>
                      <FileLink title="Hujjat" isSmall={true} url={item?.filePath} />
                    </div>
                    <div className="text-center">
                      {!!currentBadge && <Badge variant={currentBadge.variant}>{currentBadge.label}</Badge>}
                    </div>
                    <div className="text-neutral-500 text-sm w-[120px] text-center">{getDate(item?.uploadDate)}</div>
                    {user?.role === UserRoles.INSPECTOR && !item?.status && (
                      <div className="flex gap-1.5">
                        <Button
                          onClick={() => {
                            acceptReport(item?.id).then(() => toast.success('Muvaffaqiyatli saqlandi!'));
                          }}
                          size="sm"
                          variant="success"
                        >
                          Qabul qilish
                        </Button>
                        <RejectExecution id={item?.id} />
                      </div>
                    )}
                    {!!item?.rejectedReason && (
                      <div className="ml-auto">
                        <Popover>
                          <PopoverTrigger>
                            <Button size="iconSm" variant="outline">
                              <CircleAlert />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <p className="text-sm">{item?.rejectedReason}</p>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {isFormShow && (
              <>
                <hr className="border-neutral-50" />
                <Form {...form}>
                  <form className="max-w-[400px]" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-2 items-start">
                      <div className="flex-grow">
                        <FormField
                          name="paramValue"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Javob fayli</FormLabel>
                              <FormControl>
                                <InputFile
                                  buttonText="Faylni yuklang"
                                  showPreview={true}
                                  form={form}
                                  name={field.name}
                                  accept={[FileTypes.PDF]}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="pt-[25px]">
                        <Button disabled={isPending} size="icon">
                          <SendHorizontal />
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportExecutionModal;
