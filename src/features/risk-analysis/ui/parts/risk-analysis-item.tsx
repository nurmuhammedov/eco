import { Button, buttonVariants } from '@/shared/components/ui/button.tsx';
import { Check, Minus } from 'lucide-react';
import { Textarea } from '@/shared/components/ui/textarea.tsx';
import { FC } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form.tsx';
import { useRejectRiskItem } from '@/features/risk-analysis/hooks/use-reject-risk-item.ts';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types.ts';
import { useSearchParams } from 'react-router-dom';
import { useUploadFiles } from '@/shared/components/common/file-upload/api/use-upload-files.ts';
import { useAttachFile } from '@/features/risk-analysis/hooks/use-attach-file.ts';
import FileLink from '@/shared/components/common/file-link.tsx';
import { useCancelPoints } from '@/features/risk-analysis/hooks/use-cancel-points.ts';
import { clsx } from 'clsx';

interface Props {
  number: number;
  data: any;
  globalData: any[];
}

const schema = z
  .object({
    isReject: z.boolean({ message: 'Обязательное поле' }).default(false),
    description: z.string().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.isReject && data.description.trim().length < 10) {
      ctx.addIssue({
        path: ['description'],
        code: z.ZodIssueCode.too_small,
        minimum: 10,
        type: 'string',
        inclusive: true,
        message: 'Too short value',
      });
    }
  });

const RiskAnalysisItem: FC<Props> = ({ data, number, globalData }) => {
  const [searchParams] = useSearchParams();
  const currentCat = searchParams.get('type') || '';
  const currentInervalId = searchParams.get('intervalId') || '';
  const paragraphName = `PARAGRAPH_${currentCat?.toUpperCase()}_${number}`;
  const { mutate } = useRejectRiskItem();
  const { user } = useAuth();
  const isValidInterval = currentInervalId == user?.interval?.id;
  const isInspector = user?.role === UserRoles.INSPECTOR;
  const isLegal = user?.role === UserRoles.LEGAL;
  const { mutate: attachFile, isPending: isPendingAttachFile } = useAttachFile();
  const { mutateAsync: sendFiles, isPending } = useUploadFiles();
  const { mutate: cancelPoints } = useCancelPoints();
  const currentItem = globalData?.find((item) => item.indicatorType === paragraphName);
  const isConfirmed = currentItem?.score === 0 && !!currentItem?.filePath;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const isReject = form.watch('isReject');
  console.log(currentInervalId);
  const onSubmit = (data: any) => {
    mutate({
      data: {
        description: data.description,
        indicatorType: paragraphName,
      },
      type: currentCat,
    });
  };
  return (
    <div key={data.title}>
      <div
        className={clsx('bg-[#EDEEEE] shadow-md p-2.5 rounded font-medium', {
          'bg-red-200': !!currentItem?.score && currentItem?.score > 0,
          'bg-green-200': isConfirmed,
        })}
      >
        {number}. {data.title} - <b>{data.point}</b> ball
      </div>
      <div
        className={clsx('flex items-center py-5 px-2.5 gap-4 my-2', {
          'bg-red-50': !!currentItem?.score && currentItem?.score > 0,
          'bg-green-50': isConfirmed,
        })}
      >
        <div className="flex-grow">{data.title}</div>
        <Form {...form}>
          <div className="flex-shrink-0 flex gap-3  w-full max-w-[600px] items-center">
            <div className="flex gap-1 flex-shrink-0">
              {isInspector && isValidInterval && (
                <>
                  <Button
                    onClick={() => {
                      if (confirm('Cancel points?')) {
                        cancelPoints(currentItem.id);
                      }
                    }}
                    disabled={!isInspector || isConfirmed || !currentItem?.filePath}
                    type="button"
                    className="flex-shrink-0"
                    variant={isConfirmed ? 'success' : 'successOutline'}
                    size="icon"
                  >
                    <Check />
                  </Button>
                  <Button
                    onClick={() => {
                      form.setValue('isReject', !isReject);
                    }}
                    disabled={!!currentItem || !isInspector}
                    type="button"
                    className="flex-shrink-0"
                    variant={isReject || !!currentItem ? 'destructive' : 'destructiveOutline'}
                    size="icon"
                  >
                    <Minus />
                  </Button>
                </>
              )}
              {(!isInspector || !isValidInterval) && (
                <>
                  {!currentItem && (
                    <Button type="button" className="flex-shrink-0" variant={'successOutline'} size="icon">
                      <Check />
                    </Button>
                  )}
                  {!!currentItem && isConfirmed && (
                    <Button
                      type="button"
                      className="flex-shrink-0"
                      variant={isConfirmed ? 'success' : 'successOutline'}
                      size="icon"
                    >
                      <Check />
                    </Button>
                  )}
                  {!!currentItem && !isConfirmed && (
                    <Button type="button" className="flex-shrink-0" variant={'destructive'} size="icon">
                      <Minus />
                    </Button>
                  )}
                </>
              )}
            </div>
            <div className="relative w-full">
              <FormField
                defaultValue={currentItem?.description ? currentItem?.description : ''}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={!isReject || !!currentItem}
                        className="resize-none w-full"
                        rows={2}
                        placeholder="Boshqarma boshlig‘i rezolyutsiyasi"
                        {...field}
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isReject && !currentItem && (
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className="absolute top-6 right-2 opacity-80 hover:opacity-100"
                  size="sm"
                  variant="outline"
                >
                  Yuborish
                </Button>
              )}
            </div>
            {isLegal && !!currentItem && !currentItem?.filePath && (
              <label className={buttonVariants({ size: 'sm' })}>
                Batraf etish
                <input
                  disabled={isPending || isPendingAttachFile}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files?.length) {
                      sendFiles([files[0]]).then((data) => attachFile({ id: currentItem?.id, path: data }));
                    }
                  }}
                  className="hidden"
                  type="file"
                  accept={FileTypes.PDF}
                />
              </label>
            )}
            {!!currentItem?.filePath && <FileLink isSmall={true} title={'Ma’lumotnoma'} url={currentItem?.filePath} />}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RiskAnalysisItem;
