import { useMemo } from 'react';
import { useForm, useFieldArray, Controller, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format as formatDateFn } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertCircle, FileText, Pencil } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import DatePicker from '@/shared/components/ui/datepicker';
import { Textarea } from '@/shared/components/ui/textarea';
import InspectionChecklistModal from '@/features/inspections/ui/parts/inspection-checklist-modal';
import AcknowledgementUploadModal from '@/features/inspections/ui/parts/acknowledgement-upload-modal';
import { useAdd, useCustomSearchParams } from '@/shared/hooks';
import { ChecklistAnswerStatus } from '../../model/inspection-checklist.schema';

const itemSchema = z
  .object({
    id: z.string(),
    orderNumber: z.number(),
    question: z.string(),
    answer: z.nativeEnum(ChecklistAnswerStatus, {
      errorMap: () => ({ message: 'Javob tanlanishi shart' }),
    }),
    description: z.string().optional().nullable(),
    deadline: z.union([z.string(), z.date()]).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.answer === ChecklistAnswerStatus.NEGATIVE) {
      if (!data.description || data.description.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Chora-tadbir matni kiritilishi shart',
          path: ['description'],
        });
      }
      if (!data.deadline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Muddat belgilanilishi shart',
          path: ['deadline'],
        });
      }
    }
  });

const categorySchema = z.object({
  inspectionCategoryId: z.string(),
  categoryName: z.string(),
  items: z.array(itemSchema),
});

const formSchema = z.object({
  categories: z.array(categorySchema),
});

type FormValues = z.infer<typeof formSchema>;

export const answerOptions = [
  { value: ChecklistAnswerStatus.POSITIVE, labelKey: 'Bajarilgan' },
  { value: ChecklistAnswerStatus.NEGATIVE, labelKey: 'Bajarilmagan' },
  { value: ChecklistAnswerStatus.PARTIAL, labelKey: 'Tatbiq etilmaydi' },
];

type CategoryProps = {
  inspectionCategoryId: string;
  categoryName: string;
  checklists: {
    id: string;
    orderNumber: number;
    question: string;
    answer?: string | null;
    corrective?: string | null;
    deadline?: string | null;
    inspectionCategoryId?: string;
  }[];
};

interface Props {
  categories: CategoryProps[];
  resultId: string;
  acknowledgementPath?: string | null;
  disabled?: boolean;
}

const InspectionChecklistFormV2 = ({ categories = [], resultId, acknowledgementPath }: Props) => {
  const qc = useQueryClient();
  const { mutateAsync: postChecklists, isPending: isLoading } = useAdd('/inspection-checklists');
  const { mutateAsync: postChecklists2, isPending: isLoading2 } = useAdd('/inspection-checklists');
  const { addParams } = useCustomSearchParams();

  const disabled = acknowledgementPath == null;

  const defaultValues: FormValues = useMemo(
    () => ({
      categories: categories.map((cat) => ({
        inspectionCategoryId: cat.inspectionCategoryId || cat.checklists?.[0]?.inspectionCategoryId || '',
        categoryName: cat.categoryName || '',
        items: (cat.checklists || []).map((it) => ({
          id: it.id,
          question: it.question,
          orderNumber: it.orderNumber,
          answer: (it.answer as ChecklistAnswerStatus) ?? undefined,
          description: it.corrective ?? '',
          deadline: it.deadline ?? undefined,
        })),
      })),
    }),
    [categories],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { fields: categoryFields } = useFieldArray({
    control: form.control,
    name: 'categories',
  });

  const buildDtoListFromValues = (values: FormValues) => {
    const dtoList: any[] = [];
    values.categories.forEach((cat) => {
      cat.items.forEach((it) => {
        if (it.answer) {
          dtoList.push({
            inspectionChecklistId: it.id,
            answer: it.answer,
            corrective: it.answer === ChecklistAnswerStatus.NEGATIVE ? it.description || null : null,
            deadline:
              it.answer === ChecklistAnswerStatus.NEGATIVE && it.deadline
                ? typeof it.deadline === 'string'
                  ? it.deadline
                  : formatDateFn(it.deadline, 'yyyy-MM-dd')
                : null,
          });
        }
      });
    });
    return dtoList;
  };

  const handleTempSave = () => {
    const values = form.getValues();
    let hasChecklistError = false;
    let firstErrorPath: any = null;

    values.categories.forEach((cat, catIndex) => {
      cat.items.forEach((item, itemIndex) => {
        if (item.answer === ChecklistAnswerStatus.NEGATIVE) {
          if (!item.description || item.description.trim() === '') {
            const fieldName = `categories.${catIndex}.items.${itemIndex}.description` as const;
            form.setError(fieldName, { type: 'manual', message: '' });
            if (!firstErrorPath) firstErrorPath = fieldName;
            hasChecklistError = true;
          }

          if (!item.deadline) {
            const fieldName = `categories.${catIndex}.items.${itemIndex}.deadline` as const;
            form.setError(fieldName, { type: 'manual', message: '' });
            if (!firstErrorPath) firstErrorPath = fieldName;
            hasChecklistError = true;
          }
        }
      });
    });

    if (hasChecklistError) {
      if (firstErrorPath) form.setFocus(firstErrorPath);
      toast.error('Bajarilmagan deb belgilangan bandlar to‘liq to‘ldirilishi shart!', { richColors: true });
      return;
    }

    const dtoList = buildDtoListFromValues(values);
    if (!dtoList.length) {
      toast.error('Vaqtincha saqlash uchun kamida bitta javob belgilanishi kerak.', { richColors: true });
      return;
    }

    postChecklists({ dtoList, resultId }).then(() => {
      toast?.success('Muvaffaqiyatli saqlandi!', { richColors: true });
      qc.invalidateQueries({ queryKey: [`/inspection-checklists`, { resultId }] }).then((r) => console.log(r));
    });
  };

  const onSubmit = (values: FormValues) => {
    const dtoList = buildDtoListFromValues(values);

    if (dtoList.length === 0) {
      toast.error('Hech qanday maʼlumot kiritilmadi.', { richColors: true });
      return;
    }

    postChecklists2({ dtoList, resultId }).then(() => {
      addParams({ modal: 'addUsers' });
      qc.invalidateQueries({ queryKey: [`/inspection-checklists`, { resultId }] }).then((r) => console.log(r));
      qc.invalidateQueries({ queryKey: ['/inspection-results'] }).then((r) => console.log(r));
    });
  };

  const onInvalid = () => {
    toast.error('Iltimos, barcha belgilangan maydonlarni to‘g‘ri to‘ldiring.', { richColors: true });
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={(e) => e?.preventDefault()}>
        {disabled ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mb-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 text-sm mb-1">Diqqat, tilxat fayli yuklanmagan!</h4>
                <p className="text-amber-800 text-sm mb-3 leading-relaxed">
                  Tekshiruv savolnomasini to‘ldirish uchun avval tilxat yuklanishi shart.
                </p>
                <AcknowledgementUploadModal
                  resultId={resultId}
                  acknowledgementPath={acknowledgementPath}
                  trigger={
                    <Button
                      size="default"
                      variant="default"
                      className="bg-amber-600 cursor-pointer hover:bg-amber-700 text-white border-none shadow-sm"
                    >
                      <FileText className="mr-2 h-4 w-4" /> Tilxat faylini yuklash
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Tilxat fayli</p>
                <a
                  href={acknowledgementPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Faylni ko‘rish
                </a>
              </div>
            </div>

            <AcknowledgementUploadModal
              resultId={resultId}
              acknowledgementPath={acknowledgementPath}
              trigger={
                <Button variant="outline" size="sm" className="h-9">
                  <Pencil className="mr-2 h-3.5 w-3.5" /> O‘zgartirish
                </Button>
              }
            />
          </div>
        )}

        {categoryFields.map((catField, catIndex) => (
          <div key={catField.id} className="mb-4 border rounded-xl p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{form.getValues(`categories.${catIndex}.categoryName`)}</h3>
            <CategoryItemsList control={form.control} catIndex={catIndex} items={catField.items} disabled={disabled} />
          </div>
        ))}

        <InspectionChecklistModal
          resultId={resultId}
          items={form.getValues().categories.flatMap((c) =>
            c.items.map((it) => ({
              answer: it.answer,
              inspectionChecklistId: it.id,
              corrective: it.answer === ChecklistAnswerStatus.NEGATIVE ? it.description || null : null,
              deadline:
                it.answer === ChecklistAnswerStatus.NEGATIVE && it.deadline
                  ? typeof it.deadline === 'string'
                    ? it.deadline
                    : formatDateFn(it.deadline, 'yyyy-MM-dd')
                  : null,
            })),
          )}
        />

        <div className="flex gap-2 justify-end sticky bottom-4 z-10">
          <Button
            type="button"
            className="cursor-pointer"
            onClick={handleTempSave}
            disabled={disabled}
            loading={isLoading}
          >
            Vaqtincha saqlash
          </Button>
          <Button
            type="button"
            variant="success"
            disabled={disabled}
            loading={isLoading2}
            onClick={form.handleSubmit(onSubmit, onInvalid)}
          >
            Yuborish
          </Button>
        </div>
      </form>
    </Form>
  );
};

const CategoryItemsList = ({
  control,
  catIndex,
  items,
  disabled,
}: {
  control: Control<FormValues>;
  catIndex: number;
  items: FormValues['categories'][0]['items'];
  disabled?: boolean;
}) => {
  return (
    <>
      {items.map((item, itemIndex) => {
        const prefix = `categories.${catIndex}.items.${itemIndex}` as const;

        return (
          <Card key={item.id} className="mb-3 overflow-hidden border-gray-200">
            <CardHeader className="bg-gray-50/50 py-3">
              <CardTitle className="text-base font-medium leading-snug">
                {itemIndex + 1}. {item.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-4">
              <FormField
                control={control}
                name={`${prefix}.answer`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base text-black font-medium mb-2">Javob:</FormLabel>
                    <FormControl>
                      <div className="flex flex-row flex-wrap items-center gap-x-6 gap-y-2">
                        {answerOptions.map((option) => (
                          <label
                            key={option.value}
                            className={`flex items-center gap-2 transition-colors select-none ${
                              disabled ? 'cursor-not-allowed opacity-60 pointer-events-none' : 'cursor-pointer'
                            }`}
                          >
                            <input
                              type="radio"
                              className={`w-4 h-4 accent-blue-600 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              name={field.name}
                              value={option.value}
                              checked={field.value === option.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              disabled={disabled}
                            />
                            <span className="text-sm font-medium">{option.labelKey}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                control={control}
                name={`${prefix}.answer`}
                render={({ field: ansField }) => {
                  if (ansField.value !== ChecklistAnswerStatus.NEGATIVE) return <></>;
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-dashed mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <FormField
                        control={control}
                        name={`${prefix}.description`}
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-3">
                            <FormLabel>Chora-tadbir matni *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Chora-tadbir matnini kiriting..."
                                className="min-h-[80px]"
                                {...field}
                                value={field.value || ''}
                                disabled={disabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`${prefix}.deadline`}
                        render={({ field }) => {
                          const dateValue = field.value ? new Date(field.value) : undefined;
                          return (
                            <FormItem className="col-span-1 md:col-span-1 flex flex-col">
                              <FormLabel>Bartaraf etish muddati *</FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={dateValue}
                                  disableStrategy="before"
                                  onChange={field.onChange}
                                  disabled={disabled}
                                  placeholder="Muddatni tanlang"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  );
                }}
              />
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default InspectionChecklistFormV2;
