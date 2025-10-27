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
import { Indicator } from '../riskAnalysis'; // To'g'ri tipni import qilamiz

interface Props {
  number: string;
  data: Indicator;
  displayIndex: number;
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

const statusMap: Record<string, string> = {
  UPLOADED: 'Tadbirkor tomonidan ijro uchun fayl yuklangan',
  REJECTED: 'Inspektor tomonidan rad etilgan',
  EXISTING: 'Reestrda ushbu fayl mavjud',
  COMPLETED: 'Inspektor tomonidan qabul qilingan',
  EXPIRED: "Faylning amal qilish muddati o'tgan",
  NOT_EXISTING: 'Reestrda ushbu fayl mavjud emas',
  NOT_EXPIRY_DATE: 'Faylning amal qilish muddati kiritilmagan',
};

const RiskAnalysisItem: FC<Props> = ({ data, number, displayIndex }) => {
  const [searchParams] = useSearchParams();
  const currentCat = searchParams.get('type') || '';
  const currentInervalId = searchParams.get('intervalId') || '';
  const paragraphName = `PARAGRAPH_${currentCat?.toUpperCase()}_${number}`;
  const { mutate } = useRejectRiskItem();
  const { user } = useAuth();
  const isValidInterval = currentInervalId == user?.interval?.id;
  const isChairman = user?.role === UserRoles.CHAIRMAN;
  const isInspector = user?.role === UserRoles.INSPECTOR;
  const isLegal = user?.role === UserRoles.LEGAL;
  const { mutate: attachFile, isPending: isPendingAttachFile } = useAttachFile();
  const { mutateAsync: sendFiles, isPending } = useUploadFiles();
  const { mutate: cancelPoints } = useCancelPoints();
  const isConfirmed = data?.score === 0;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const isReject = form.watch('isReject');
  const onSubmit = (data: any) => {
    mutate({
      data: {
        description: data.description,
        indicatorType: paragraphName,
      },
      type: currentCat,
    });
  };

  let statusText: string | null = null;

  if (data?.status) {
    if (data.score > 0) {
      statusText = statusMap[data.status];
    }
  }

  return (
    <div key={data.text}>
      <div
        className={clsx('bg-[#EDEEEE] shadow-md p-2.5 rounded font-medium', {
          'bg-red-200': !!data?.score && data?.score > 0,
          'bg-green-200': isConfirmed,
        })}
      >
        <div className="flex justify-between gap-2">
          <div>
            {displayIndex}. {data.text} - <b>{data.maxScore}</b> ball
          </div>
          {data?.score == 0 ? (
            <div className="pr-4">
              <b>0</b> ball
            </div>
          ) : (
            <div className="pr-4">
              <b>{data?.score}</b> ball
            </div>
          )}
        </div>
      </div>
      <div
        className={clsx('flex items-center py-5 px-2.5 gap-4 my-2', {
          'bg-red-50': !!data?.score && data?.score > 0,
          'bg-green-50': isConfirmed,
        })}
      >
        <div className="flex-grow flex flex-col">
          <span>{data.text}</span>

          {statusText && <span className={clsx('text-sm font-semibold mt-1 italic')}>* {statusText}</span>}
        </div>

        <Form {...form}>
          <div className="flex-shrink-0 flex gap-3  w-full max-w-[600px] items-center">
            <div className="flex gap-1 flex-shrink-0">
              {isInspector && isValidInterval && (
                <>
                  <Button
                    onClick={() => {
                      if (confirm('Cancel points?')) {
                        cancelPoints(data.id);
                      }
                    }}
                    disabled={!isInspector || isConfirmed || !data?.filePath}
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
                    disabled={!!data || !isInspector}
                    type="button"
                    className="flex-shrink-0"
                    variant={isReject || !!data ? 'destructive' : 'destructiveOutline'}
                    size="icon"
                  >
                    <Minus />
                  </Button>
                </>
              )}
              {!isChairman && (!isInspector || !isValidInterval) && (
                <>
                  {!data && (
                    <Button type="button" className="flex-shrink-0" variant={'successOutline'} size="icon">
                      <Check />
                    </Button>
                  )}
                  {!!data && isConfirmed && (
                    <Button
                      type="button"
                      className="flex-shrink-0"
                      variant={isConfirmed ? 'success' : 'successOutline'}
                      size="icon"
                    >
                      <Check />
                    </Button>
                  )}
                  {!!data && !isConfirmed && (
                    <Button type="button" className="flex-shrink-0" variant={'destructive'} size="icon">
                      <Minus />
                    </Button>
                  )}
                </>
              )}
            </div>
            {!isChairman && (
              <div className="relative w-full">
                <FormField
                  defaultValue={data?.description ? data?.description : ''}
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          disabled={!isReject || !!data}
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
                {isReject && !data && (
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
            )}

            {isLegal && !!data && !data?.filePath && (
              <label className={buttonVariants({ size: 'sm' })}>
                Batraf etish
                <input
                  disabled={isPending || isPendingAttachFile}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files?.length) {
                      // 3. XATOLIKNI TUZATAMIZ:
                      sendFiles([files[0]]).then((filePath) => {
                        // `filePath` -> sendFiles dan qaytgan string (fayl manzili)
                        attachFile({
                          id: number, // Indikator ID si `number` propidan olinadi
                          path: filePath, // Fayl manzili `sendFiles` natijasidan olinadi
                        });
                      });
                    }
                  }}
                  className="hidden"
                  type="file"
                  accept={FileTypes.PDF}
                />
              </label>
            )}
            {!!data?.filePath && <FileLink isSmall={true} title={'Ma’lumotnoma'} url={data?.filePath} />}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RiskAnalysisItem;
