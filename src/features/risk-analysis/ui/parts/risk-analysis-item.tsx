import { Button } from '@/shared/components/ui/button.tsx';
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

interface Props {
  number: number;
  data: any;
  globalData: any[];
}

const schema = z.object({
  isReject: z.boolean({ message: 'Обязательное поле' }).default(false),
  description: z.string().default('')
}).superRefine((data, ctx) => {
  if (data.isReject && data.description.trim().length < 10) {
    ctx.addIssue({
      path: ['description'],
      code: z.ZodIssueCode.too_small,
      minimum: 10,
      type: 'string',
      inclusive: true,
      message: 'Too short value'
    });
  }
});

const RiskAnalysisItem: FC<Props> = ({ data, number, globalData }) => {
  const { mutate } = useRejectRiskItem();
  const { user } = useAuth();
  const isManager = user?.role === UserRoles.MANAGER;
  //TODO: add actual interval check
  const currentItem = globalData?.find(item => item.indicatorType === 'PARAGRAPH_HF_' + number);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const isReject = form.watch('isReject');

  const onSubmit = (data: any) => {
    mutate({ data: { description: data.description }, type: 'hf' });
  };
  return (
    <div key={data.title}>
      <div className="bg-[#EDEEEE] shadow-md p-2.5 rounded font-medium">
        {number}. {data.title} - <b>{data.point}</b> ball
      </div>
      <div className="flex items-center py-5 px-2.5 gap-4">
        <div className="flex-grow">{data.title}</div>
        <Form {...form}>
          <div className="flex-shrink-0 flex gap-3  w-full max-w-[500px] items-center">
            <div className="flex gap-1 flex-shrink-0">
              <Button disabled={true} type="button" className="flex-shrink-0" variant="successOutline" size="icon">
                <Check />
              </Button>
              <Button onClick={() => {
                form.setValue('isReject', !isReject);
              }}
                      disabled={!!currentItem || !isManager}
                      type="button"
                      className="flex-shrink-0"
                      variant={isReject || !!currentItem ? 'destructive' : 'destructiveOutline'}
                      size="icon">
                <Minus />
              </Button>
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
                        disabled={!isReject}
                        className="resize-none w-full"
                        rows={2}
                        placeholder="Boshqarma boshlig‘i rezolyutsiyasi"
                        {...field}
                      >

                      </Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isReject && <Button onClick={form.handleSubmit(onSubmit)}
                                   className="absolute top-6 right-2 opacity-80 hover:opacity-100" size="sm"
                                   variant="outline">Yuborish</Button>}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RiskAnalysisItem;