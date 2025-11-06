import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types';
import {
  ChecklistAnswerStatus,
  ChecklistFormValues,
  checklistFormSchema,
} from '../../model/inspection-checklist.schema';
import { useAdd } from '@/shared/hooks';
import { InputFile } from '@/shared/components/common/file-upload';
import { useQueryClient } from '@tanstack/react-query';
import { QK_INSPECTION } from '@/shared/constants/query-keys';

interface InspectionChecklistFormProps {
  items: any[];
  inspectionId: string | number;
  onSuccess?: () => void;
}

const answerOptions = [
  {
    value: ChecklistAnswerStatus.POSITIVE,
    labelKey: 'Bajarilgan',
  },
  {
    value: ChecklistAnswerStatus.NEGATIVE,
    labelKey: 'Bajarilmagan',
  },
  {
    value: ChecklistAnswerStatus.PARTIAL,
    labelKey: 'Tadbiq etilmaydi',
  },
  // {
  //   value: ChecklistAnswerStatus.UNRELATED,
  //   labelKey: 'Tadbiq etilmaydi',
  // },
];

export const InspectionChecklistForm = ({ items, inspectionId }: InspectionChecklistFormProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistFormSchema),
    defaultValues: {
      items: items.map((item) => ({
        id: item.id,
        question: item.question,
        orderNumber: item.orderNumber,
        answer: undefined,
        description: '',
        file: null,
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const categoryTitle = items.length > 0 ? items[0].categoryTypeName : '';

  const { mutateAsync, isPending } = useAdd('/inspection-results');

  const handleFormSubmit = (data: ChecklistFormValues) => {
    const payload: any[] = data.items.map((item) => ({
      question: item.question,
      answer: item.answer,
      orderNumber: item.orderNumber,
      description: item.description || null,
      filePath: item.file ? item.file : null,
    }));

    mutateAsync({ dtoList: payload, inspectionId }).then(async () => {
      console.log('payload');
      await queryClient.invalidateQueries({ queryKey: [QK_INSPECTION] });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 pb-3">
        {categoryTitle && <h3 className="text-xl font-semibold">{categoryTitle}</h3>}

        {fields.map((field, index) => (
          <Card key={field.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {index + 1}. {field.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name={`items.${index}.answer`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('common:answer', 'Javob')}:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row flex-wrap items-center gap-x-6 gap-y-2"
                      >
                        {answerOptions.map((option) => (
                          <FormItem key={option.value} className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{t(option.labelKey)}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common:description', 'Izoh')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('common:enter_description', 'Izoh kiriting...')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.file`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>{t('common:file', 'Fayl')}</FormLabel>
                      <FormControl>
                        <InputFile form={form} name={field.name} accept={[FileTypes.PDF]} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <Button type="submit" disabled={isPending} className="self-end">
          {isPending ? t('common:loading', 'Yuklanmoqda...') : t('common:submit', 'Yuborish')}
        </Button>
      </form>
    </Form>
  );
};
